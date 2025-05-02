
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, loading } = useAuth();
  
  // Get the intended destination from location state or default to /browse
  const from = location.state?.from || '/browse';
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await signUp(email, password, fullName);
    
    if (!error) {
      // Navigation will happen automatically in the PublicRoute component
      console.log("Registration successful, redirecting to:", from);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png" alt="Study Hub" className="h-8 w-auto" />
              <span className="font-display font-semibold text-xl">Study Hub</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm" variant="default" className="bg-studyhub-500 hover:bg-studyhub-600">
                Join Us
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex">
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src="/lovable-uploads/c172c73b-f266-4337-a8c2-a9a9e25149fb.png"
            alt="Campus entrance" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-studyhub-900/20 to-transparent"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Sign up</h1>
              <p className="text-gray-600">Join us today on Study Hub!</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Re-enter password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-studyhub-500 hover:bg-studyhub-600 h-11" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-studyhub-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Register;
