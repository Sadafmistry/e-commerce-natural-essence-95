import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Heart, Award, Users, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import coffeeScrub from '@/assets/coffee-scrub.jpg';
import lavenderScrub from '@/assets/lavender-scrub.jpg';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'We source only the finest organic ingredients from trusted suppliers who share our commitment to sustainability and quality.'
    },
    {
      icon: Heart,
      title: 'Cruelty Free',
      description: 'Never tested on animals. We believe beauty should never come at the cost of animal welfare and ethical standards.'
    },
    {
      icon: Award,
      title: 'Handcrafted Quality',
      description: 'Each product is lovingly handmade in small batches to ensure the highest quality and freshness for your skin.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'We support local communities and fair trade practices, creating positive impact beyond beautiful skincare.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Natural Ingredients' },
    { number: '5★', label: 'Average Rating' },
    { number: '3', label: 'Years of Excellence' }
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹999'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '30-day money back'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Born from a passion for natural beauty and sustainable living, 
              Natural Essence creates handcrafted body scrubs that love your skin and the planet.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Natural Essence, we believe that skincare should be a luxurious, natural experience 
                  that connects you with the power of pure ingredients. Our mission is to create products 
                  that not only make your skin glow but also align with your values of sustainability 
                  and ethical consumption.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every jar of our handcrafted body scrub tells a story of carefully sourced ingredients, 
                  traditional techniques, and a commitment to quality that you can feel with every use. 
                  We're not just creating skincare products; we're crafting experiences that transform 
                  your daily routine into a moment of self-care and mindfulness.
                </p>
                <Link to="/products">
                  <Button size="lg" variant="natural">
                    Shop Our Products
                  </Button>
                </Link>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src={coffeeScrub} 
                    alt="Handcrafted body scrubs" 
                    className="rounded-lg shadow-natural hover:shadow-warm transition-shadow duration-300"
                  />
                  <img 
                    src={lavenderScrub} 
                    alt="Natural ingredients" 
                    className="rounded-lg shadow-natural hover:shadow-warm transition-shadow duration-300 mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do, from ingredient sourcing to product creation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-natural transition-all duration-300">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
                Natural Essence by Numbers
              </h2>
              <p className="text-lg text-muted-foreground">
                Our journey in creating beautiful, natural skincare.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
                Our Handcraft Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From sourcing to packaging, every step is carefully executed with love and attention to detail.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-serif font-semibold">Source & Select</h3>
                <p className="text-muted-foreground">
                  We carefully source the finest organic ingredients from trusted suppliers 
                  who share our commitment to quality and sustainability.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-serif font-semibold">Craft & Blend</h3>
                <p className="text-muted-foreground">
                  Each batch is lovingly handcrafted in small quantities to ensure 
                  freshness and the perfect balance of ingredients.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-serif font-semibold">Package & Deliver</h3>
                <p className="text-muted-foreground">
                  Your scrubs are carefully packaged in eco-friendly materials 
                  and delivered fresh to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-6">
              Ready to Experience Natural Beauty?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who have made the switch to natural, 
              handcrafted skincare that truly makes a difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/products">
                <Button size="lg" variant="natural">
                  Shop All Products
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-8 max-w-md mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;