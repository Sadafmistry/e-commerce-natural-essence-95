import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface CreateOrderRequest {
  items: OrderItem[];
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  total_amount: number;
  payment_method?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Create order function called');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    const { items, shipping_address, total_amount, payment_method }: CreateOrderRequest = await req.json();

    // Validate input
    if (!items || items.length === 0 || !shipping_address || !total_amount) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isCOD = payment_method === 'cod';
    let razorpayOrderId = null;

    // Only create Razorpay order if NOT COD
    if (!isCOD) {
      const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
      const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

      if (!razorpayKeyId || !razorpayKeySecret) {
        console.error('Razorpay configuration missing');
        return new Response(
          JSON.stringify({ error: 'Payment gateway configuration missing. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Supabase Edge Function secrets.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const orderData = {
        amount: Math.round(total_amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          user_id: user.id,
          items_count: items.length.toString()
        }
      };

      console.log('Creating Razorpay order:', orderData);

      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!razorpayResponse.ok) {
        const errorText = await razorpayResponse.text();
        console.error('Razorpay error:', errorText);
        throw new Error('Failed to create Razorpay order');
      }

      const razorpayOrder = await razorpayResponse.json();
      razorpayOrderId = razorpayOrder.id;
      console.log('Razorpay order created:', razorpayOrderId);
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        razorpay_order_id: razorpayOrderId,
        total_amount,
        status: 'order_placed',
        shipping_address,
        payment_method: isCOD ? 'cod' : 'prepaid',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order in database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created in database:', order.id);

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Try to cleanup the order
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For COD orders, clear cart immediately
    if (isCOD) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      console.log('Cart cleared for COD order');
    }

    console.log('Order completed successfully');

    return new Response(
      JSON.stringify({
        order_id: order.id,
        razorpay_order_id: razorpayOrderId,
        amount: total_amount,
        currency: 'INR',
        is_cod: isCOD,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});