import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard, MapPin, Package } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useRazorpay } from '@/hooks/useRazorpay';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { processPayment, isLoading: paymentLoading } = useRazorpay();

  const [shippingForm, setShippingForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const totalAmount = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingThreshold = 999;
  const shippingCost = totalAmount >= shippingThreshold ? 0 : 99;
  const finalTotal = totalAmount + shippingCost;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!shippingForm.name || !shippingForm.phone || !shippingForm.address || 
          !shippingForm.city || !shippingForm.state || !shippingForm.pincode) {
        toast({
          title: "Please fill all fields",
          description: "All shipping information is required.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (paymentMethod === 'razorpay') {
        // Create order via edge function
        const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
          body: {
            items: items.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
            shipping_address: shippingForm,
            total_amount: finalTotal,
          }
        });

        if (orderError) {
          throw new Error('Failed to create order');
        }

        // Process payment with Razorpay
        const paymentSuccess = await processPayment({
          orderId: orderData.razorpay_order_id,
          amount: finalTotal,
          currency: 'INR',
          name: 'Natural Essence',
          description: 'Natural Body Scrubs',
          prefill: {
            name: shippingForm.name,
            email: user?.email || '',
            contact: shippingForm.phone,
          },
        });

        if (paymentSuccess) {
          // Clear cart and redirect
          await clearCart();
          toast({
            title: "Order placed successfully!",
            description: "Thank you for your purchase. You will receive a confirmation email shortly.",
          });
          navigate('/');
        }
      } else {
        // Handle COD - create order without payment
        const { error: orderError } = await supabase.functions.invoke('create-order', {
          body: {
            items: items.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
            shipping_address: shippingForm,
            total_amount: finalTotal,
            payment_method: 'cod',
          }
        });

        if (orderError) {
          throw new Error('Failed to create COD order');
        }

        toast({
          title: "COD order placed!",
          description: "Your order will be delivered and payment collected at your doorstep.",
        });
        await clearCart();
        navigate('/');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Failed to place order",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={shippingForm.pincode}
                        onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Pay with Razorpay</div>
                        <div className="text-sm text-muted-foreground">
                          Credit Card, Debit Card, Net Banking, UPI, Wallets
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex gap-3">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-sm">{item.product.name}</div>
                            <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={isLoading || paymentLoading}
                  >
                    {(isLoading || paymentLoading) ? 'Processing...' : `Place Order - ₹${finalTotal.toFixed(2)}`}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;