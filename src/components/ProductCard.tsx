import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-natural hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-medium rounded-full">
              {product.badge}
            </span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-amber-400 fill-current'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            <Button 
              size="sm" 
              className="space-x-1"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isAdding ? 'Adding...' : 'Add'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;