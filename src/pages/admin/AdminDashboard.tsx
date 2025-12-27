import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  ArrowRight,
  LogOut
} from 'lucide-react';
import RevenueChart from '@/components/admin/RevenueChart';
import OrdersChart from '@/components/admin/OrdersChart';
import TopProductsChart from '@/components/admin/TopProductsChart';
import { format, subDays, parseISO } from 'date-fns';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface OrderData {
  date: string;
  orders: number;
}

interface ProductSalesData {
  name: string;
  sales: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductSalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch product count
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch orders
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount, status');

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

        setStats({
          totalProducts: productCount || 0,
          totalOrders,
          totalRevenue,
          pendingOrders,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
        
        // Fetch orders for charts
        const { data: orders } = await supabase
          .from('orders')
          .select('created_at, total_amount')
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: true });

        if (orders) {
          // Process revenue data by date
          const revenueByDate: Record<string, number> = {};
          const ordersByDate: Record<string, number> = {};
          
          // Initialize last 30 days with 0
          for (let i = 29; i >= 0; i--) {
            const date = format(subDays(new Date(), i), 'MMM dd');
            revenueByDate[date] = 0;
            ordersByDate[date] = 0;
          }

          orders.forEach(order => {
            const date = format(parseISO(order.created_at), 'MMM dd');
            if (revenueByDate[date] !== undefined) {
              revenueByDate[date] += Number(order.total_amount);
              ordersByDate[date] += 1;
            }
          });

          setRevenueData(
            Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue }))
          );
          setOrdersData(
            Object.entries(ordersByDate).map(([date, orders]) => ({ date, orders }))
          );
        }

        // Fetch top products by sales
        const { data: orderItems } = await supabase
          .from('order_items')
          .select(`
            price,
            quantity,
            product_id
          `);

        if (orderItems) {
          // Get product names
          const productIds = [...new Set(orderItems.map(item => item.product_id))];
          const { data: products } = await supabase
            .from('products')
            .select('id, name')
            .in('id', productIds);

          const productMap = new Map(products?.map(p => [p.id, p.name]) || []);
          
          // Calculate sales per product
          const salesByProduct: Record<string, number> = {};
          orderItems.forEach(item => {
            const productName = productMap.get(item.product_id) || 'Unknown';
            salesByProduct[productName] = (salesByProduct[productName] || 0) + (Number(item.price) * item.quantity);
          });

          // Get top 5 products
          const topProductsData = Object.entries(salesByProduct)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, sales]) => ({ name, sales }));

          setTopProducts(topProductsData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setChartsLoading(false);
      }
    };

    fetchStats();
    fetchChartData();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/admin/orders',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage your store</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">View Store</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-natural transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stat.value}
                </div>
                {stat.link && (
                  <Link to={stat.link} className="text-sm text-primary hover:underline flex items-center mt-2">
                    View details <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart data={revenueData} isLoading={chartsLoading} />
            <OrdersChart data={ordersData} isLoading={chartsLoading} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProductsChart data={topProducts} isLoading={chartsLoading} />
            
            {/* Recent Activity Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Average Order Value</span>
                  <span className="font-semibold">
                    ₹{stats.totalOrders > 0 
                      ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() 
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Order Completion Rate</span>
                  <span className="font-semibold">
                    {stats.totalOrders > 0 
                      ? Math.round(((stats.totalOrders - stats.pendingOrders) / stats.totalOrders) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Products Available</span>
                  <span className="font-semibold">{stats.totalProducts}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Product Management
              </CardTitle>
              <CardDescription>Add, edit, or remove products from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Link to="/admin/products">
                  <Button>View All Products</Button>
                </Link>
                <Link to="/admin/products/new">
                  <Button variant="outline">Add New Product</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-accent" />
                Order Management
              </CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/orders">
                <Button>View All Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
