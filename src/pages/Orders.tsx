import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, PackageCheck, CreditCard, Banknote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import OrderTimeline from '@/components/OrderTimeline';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
}

interface StatusHistory {
  id: string;
  status: string;
  changed_at: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  items?: OrderItem[];
  statusHistory?: StatusHistory[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  order_placed: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Order Placed' },
  shipped: { icon: Truck, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Shipped' },
  dispatched: { icon: PackageCheck, color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Dispatched' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
};

const paymentMethodConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  prepaid: { icon: CreditCard, color: 'bg-green-100 text-green-800 border-green-200', label: 'Prepaid' },
  cod: { icon: Banknote, color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'COD' },
};

const Orders = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
        return;
      }

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          // Fetch status history for timeline
          const { data: statusHistory } = await supabase
            .from('order_status_history')
            .select('*')
            .eq('order_id', order.id)
            .order('changed_at', { ascending: true });

          // Fetch product names for each item
          const itemsWithNames = await Promise.all(
            (items || []).map(async (item) => {
              const { data: product } = await supabase
                .from('products')
                .select('name')
                .eq('id', item.product_id)
                .maybeSingle();

              return {
                ...item,
                product_name: product?.name || 'Unknown Product',
              };
            })
          );

          return {
            ...order,
            shipping_address: order.shipping_address as Order['shipping_address'],
            items: itemsWithNames,
            statusHistory: statusHistory || [],
          };
        })
      );

      setOrders(ordersWithItems);
      setIsLoading(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-foreground">My Orders</h1>
          </div>

          {orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.order_placed;
                const StatusIcon = status.icon;
                const payment = paymentMethodConfig[order.payment_method] || paymentMethodConfig.cod;
                const PaymentIcon = payment.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:block">
                            <StatusIcon className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-medium">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`${payment.color} border`}>
                            <PaymentIcon className="h-3 w-3 mr-1" />
                            {payment.label}
                          </Badge>
                          <Badge className={`${status.color} border`}>
                            {status.label}
                          </Badge>
                          <div className="text-right hidden sm:block">
                            <p className="font-semibold text-foreground">
                              ₹{Number(order.total_amount).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items?.length || 0} item(s)
                            </p>
                          </div>
                          <ChevronRight 
                            className={`h-5 w-5 text-muted-foreground transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`} 
                          />
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="border-t bg-secondary/20">
                        <div className="pt-4 space-y-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium text-foreground mb-3">Items</h4>
                            <div className="space-y-2">
                              {order.items?.map((item) => (
                                <div 
                                  key={item.id} 
                                  className="flex justify-between items-center py-2 px-3 bg-background rounded-md"
                                >
                                  <div>
                                    <p className="font-medium text-foreground">{item.product_name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-medium text-foreground">
                                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <OrderTimeline 
                            statusHistory={order.statusHistory || []} 
                            currentStatus={order.status} 
                          />

                          <Separator />

                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
                            <p className="text-muted-foreground text-sm">
                              {order.shipping_address?.firstName} {order.shipping_address?.lastName}<br />
                              {order.shipping_address?.address}<br />
                              {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
                            </p>
                          </div>

                          <Separator />

                          {/* Order Total */}
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">Total</span>
                            <span className="text-xl font-bold text-primary">
                              ₹{Number(order.total_amount).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">Total</span>
                            <span className="text-xl font-bold text-primary">
                              ₹{Number(order.total_amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
