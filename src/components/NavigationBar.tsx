
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { User, LogIn } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  const navLinks = [
    { name: 'Upload Notes', href: '/upload', show: isAuthenticated },
    { name: 'Browse Materials', href: '/browse', show: isAuthenticated },
    { name: 'Study Tools', href: '/tools', show: isAuthenticated },
    { name: 'Support Center', href: '/support', show: true },
  ];
  
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks
              .filter(link => link.show)
              .map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm" className="bg-studyhub-500 hover:bg-studyhub-600">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
