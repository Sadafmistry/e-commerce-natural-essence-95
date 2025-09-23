import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Heart, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-scrubs.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary">
                <Leaf className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wider uppercase">
                  100% Natural & Handmade
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
                Nourish Your
                <span className="text-primary block">Skin Naturally</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Discover our collection of handcrafted body scrubs made with love and 
                natural ingredients. Transform your skincare routine with the power of nature.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Cruelty Free</div>
                  <div className="text-sm text-muted-foreground">Never tested on animals</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Pure & Natural</div>
                  <div className="text-sm text-muted-foreground">No harmful chemicals</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="lg:justify-self-end">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-warm border border-border">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Natural Ingredients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Unique Blends</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;