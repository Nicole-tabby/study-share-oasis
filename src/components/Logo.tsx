
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', withText = true }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`logo-animation ${sizes[size]}`}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="triangle triangle-1" d="M30 20L50 60L10 60L30 20Z" fill="#3c973f" />
          <path className="triangle triangle-2" d="M30 100L10 60L50 60L30 100Z" fill="#2b7a2e" />
          <path className="triangle triangle-3" d="M90 100L70 60L110 60L90 100Z" fill="#2b7a2e" />
          <path className="triangle triangle-4" d="M60 40L90 100L30 100L60 40Z" fill="#5bb35e" />
        </svg>
      </div>
      {withText && (
        <span className={`font-display font-semibold ${textSizes[size]}`}>Study Hub</span>
      )}
    </Link>
  );
};

export default Logo;
