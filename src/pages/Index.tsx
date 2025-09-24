import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Leaf, Heart, Award, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import coffeeScrub from '@/assets/coffee-scrub.jpg';
import lavenderScrub from '@/assets/lavender-scrub.jpg';
import seaSaltScrub from '@/assets/sea-salt-scrub.jpg';
import oatmealScrub from '@/assets/oatmeal-scrub.jpg';

const Index = () => {
  const featuredProducts = [
    {
      id: '1',
      name: 'Arabica Coffee Body Scrub',
      price: 599,
      originalPrice: 799,
      image: coffeeScrub,
      rating: 4.8,
      reviewCount: 124,
      description: 'Energizing coffee scrub that awakens your skin and boosts circulation naturally.',
      badge: 'Bestseller'
    },
    {
      id: '2',
      name: 'Lavender Dreams Scrub',
      price: 649,
      image: lavenderScrub,
      rating: 4.9,
      reviewCount: 89,
      description: 'Calming lavender scrub perfect for relaxation and evening skincare rituals.',
      badge: 'New'
    },
    {
      id: '3',
      name: 'Dead Sea Salt Exfoliant',
      price: 699,
      image: seaSaltScrub,
      rating: 4.7,
      reviewCount: 156,
      description: 'Mineral-rich sea salt scrub that detoxifies and purifies your skin deeply.'
    },
    {
      id: '4',
      name: 'Oatmeal Honey Gentle Scrub',
      price: 549,
      image: oatmealScrub,
      rating: 4.9,
      reviewCount: 203,
      description: 'Gentle oatmeal and honey scrub perfect for sensitive skin types.'
    }
  ];

  const benefits = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'Made with pure, organic ingredients sourced responsibly from nature.'
    },
    {
      icon: Heart,
      title: 'Cruelty Free',
      description: 'Never tested on animals. We believe in ethical beauty practices.'
    },
    {
      icon: Award,
      title: 'Handcrafted',
      description: 'Each scrub is lovingly handmade in small batches for quality.'
    },
    {
      icon: Shield,
      title: 'Chemical Free',
      description: 'No parabens, sulfates, or artificial additives. Pure and safe.'
    }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹999'
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Hassle-free returns'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure checkout'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <div className="text-center md:text-left">
                    <div className="font-semibold text-foreground">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Featured Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our most loved body scrubs, each crafted with care and natural ingredients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Natural Essence */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Why Choose Natural Essence?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're committed to creating the finest natural skincare products that love your skin.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-natural transition-all duration-300">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                  Handcrafted with Love
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Natural Essence, we believe that skincare should be a luxurious, natural experience. 
                  Each of our body scrubs is lovingly handcrafted in small batches using only the finest 
                  natural ingredients.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From energizing coffee scrubs to soothing lavender blends, our products are designed 
                  to transform your daily routine into a spa-like experience while nourishing your skin 
                  with the power of nature.
                </p>
                <Button size="lg" variant="natural">
                  Learn Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src={coffeeScrub} 
                    alt="Coffee scrub ingredients" 
                    className="rounded-lg shadow-soft hover:shadow-natural transition-shadow duration-300"
                  />
                  <img 
                    src={lavenderScrub} 
                    alt="Lavender scrub ingredients" 
                    className="rounded-lg shadow-soft hover:shadow-natural transition-shadow duration-300 mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground">
                Join Our Natural Community
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Get exclusive skincare tips, new product updates, and special offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md bg-primary-foreground text-foreground border-0 focus:ring-2 focus:ring-primary-foreground/20"
                />
                <Button variant="earth" size="lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
