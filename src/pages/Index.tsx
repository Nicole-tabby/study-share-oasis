
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavigationBar from '@/components/NavigationBar';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 my-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-6"
            >
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-3 py-1 rounded-full bg-studyhub-100 text-studyhub-800 text-sm font-medium mb-4"
                >
                  For students, by students
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight"
                >
                  Streamline Your Study Materials
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-lg text-gray-600 max-w-xl"
                >
                  Study Hub transforms study material sharing for students worldwide. Upload, find, and organize your notes in one place.
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <Button className="bg-studyhub-500 hover:bg-studyhub-600 text-white px-6 py-2 h-12 rounded-md font-medium">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" className="border-studyhub-200 text-studyhub-700 hover:bg-studyhub-50 h-12 px-6 py-2 rounded-md font-medium">
                    Browse Materials
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-4 text-sm text-gray-500"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-studyhub-100 border-2 border-white flex items-center justify-center text-xs font-medium text-studyhub-600">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ students already sharing notes</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src="/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png" 
                alt="Study materials" 
                className="w-full h-auto rounded-xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-studyhub-800/20 to-transparent rounded-xl"></div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-24 text-center"
          >
            <h2 className="text-2xl font-bold mb-8">Why students love Study Hub</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy Note Sharing",
                  description: "Upload and share your study materials with classmates in seconds"
                },
                {
                  title: "Find What You Need",
                  description: "Search for notes by course, semester, or year to find exactly what you need"
                },
                {
                  title: "Build Your Network",
                  description: "Connect with other students in your courses and collaborate effectively"
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + (i * 0.1) }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-studyhub-100 text-studyhub-600 flex items-center justify-center mb-4 mx-auto">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo />
              <p className="text-gray-500 text-sm mt-2">
                Simplifying study material sharing since 2023
              </p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="font-medium mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><Link to="/browse" className="text-gray-500 hover:text-studyhub-600 text-sm">Browse Notes</Link></li>
                  <li><Link to="/upload" className="text-gray-500 hover:text-studyhub-600 text-sm">Upload Materials</Link></li>
                  <li><Link to="/tools" className="text-gray-500 hover:text-studyhub-600 text-sm">Study Tools</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-500 hover:text-studyhub-600 text-sm">About Us</Link></li>
                  <li><Link to="/support" className="text-gray-500 hover:text-studyhub-600 text-sm">Support</Link></li>
                  <li><Link to="/privacy" className="text-gray-500 hover:text-studyhub-600 text-sm">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Study Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
