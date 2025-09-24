import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      {/* SVG Logo Icon */}
      <div className="relative">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Background Circle with Natural Texture */}
          <circle 
            cx="20" 
            cy="20" 
            r="19" 
            fill="url(#sageGradient)"
            stroke="hsl(var(--sage-600))" 
            strokeWidth="0.5"
            opacity="0.9"
          />
          
          {/* Stylized Leaf Design */}
          <path 
            d="M12 24c0-6 4-12 8-12s8 6 8 12c0 2-1 4-3 5-1 0.5-2 1-3 1h-2c-1 0-2-0.5-3-1-2-1-3-3-3-5z" 
            fill="hsl(var(--sage-50))"
            fillOpacity="0.9"
          />
          
          {/* Leaf Vein */}
          <path 
            d="M20 12v12" 
            stroke="hsl(var(--sage-700))" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Side Veins */}
          <path 
            d="M16 18l4-2m0 4l4-2" 
            stroke="hsl(var(--sage-600))" 
            strokeWidth="1" 
            strokeLinecap="round"
            opacity="0.6"
          />
          
          {/* Natural Dots for Texture */}
          <circle cx="15" cy="20" r="0.8" fill="hsl(var(--sage-600))" opacity="0.4" />
          <circle cx="25" cy="18" r="0.6" fill="hsl(var(--sage-600))" opacity="0.3" />
          <circle cx="22" cy="26" r="0.7" fill="hsl(var(--sage-600))" opacity="0.4" />
          
          {/* Gradient Definitions */}
          <defs>
            <radialGradient id="sageGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="hsl(var(--sage-300))" />
              <stop offset="70%" stopColor="hsl(var(--sage-400))" />
              <stop offset="100%" stopColor="hsl(var(--sage-500))" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-serif font-bold text-foreground leading-tight tracking-wide group-hover:text-primary transition-colors duration-300">
          Natural Essence
        </span>
        <span className="text-xs font-sans text-muted-foreground tracking-widest uppercase">
          Handcrafted Body Care
        </span>
      </div>
    </Link>
  );
};

export default Logo;