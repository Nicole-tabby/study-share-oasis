
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Menu, X, User, FileText, BookmarkCheck, LogOut, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out successfully",
    });
    
    navigate('/login');
  };

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const user = getUserData();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png"
              alt="Study Hub"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg text-gray-900 dark:text-white">Study Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/browse"
              className={`text-sm font-medium ${
                location.pathname === '/browse'
                  ? 'text-studyhub-600 dark:text-studyhub-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-studyhub-500 dark:hover:text-studyhub-400'
              }`}
            >
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Browse Notes</span>
              </div>
            </Link>
            
            <Link
              to="/upload"
              className={`text-sm font-medium ${
                location.pathname === '/upload'
                  ? 'text-studyhub-600 dark:text-studyhub-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-studyhub-500 dark:hover:text-studyhub-400'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Upload className="h-4 w-4" />
                <span>Upload Notes</span>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-gray-700 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`} 
                      alt={user?.fullName || 'User'} 
                    />
                    <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem 
                  className="flex items-center dark:text-gray-300 dark:focus:bg-gray-700"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center dark:text-gray-300 dark:focus:bg-gray-700"
                  onClick={() => navigate('/profile')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>My Notes</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center dark:text-gray-300 dark:focus:bg-gray-700"
                  onClick={() => navigate('/profile')}
                >
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  <span>Saved Notes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center text-red-600 dark:text-red-500 dark:focus:bg-gray-700" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-700" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm md:hidden">
          <div className="fixed right-0 top-0 h-full w-3/4 bg-white dark:bg-gray-900 shadow-xl p-5">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img
                  src="/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png"
                  alt="Study Hub"
                  className="h-8 w-8"
                />
                <span className="font-bold text-lg text-gray-900 dark:text-white">Study Hub</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-6 w-6 dark:text-gray-300" />
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`} 
                  alt={user?.fullName || 'User'} 
                />
                <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Navigation</p>
                <Link 
                  to="/browse" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleMobileMenu}
                >
                  <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-100">Browse Notes</span>
                </Link>
                <Link 
                  to="/upload" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleMobileMenu}
                >
                  <Upload className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-100">Upload Notes</span>
                </Link>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account</p>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleMobileMenu}
                >
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-100">View Profile</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleMobileMenu}
                >
                  <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-100">My Notes</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleMobileMenu}
                >
                  <BookmarkCheck className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-900 dark:text-gray-100">Saved Notes</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="flex items-center gap-2"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="text-red-600 dark:text-red-500"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
