
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Bookmark, ArrowUp, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Browse = () => {
  const [semester, setSemester] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication status on mount
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleSearch = () => {
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery || 'all notes'} in ${semester || 'all semesters'} for ${courseYear || 'all years'}`,
    });
  };
  
  const recentNotes = [
    {
      id: 1,
      title: "Explore Your Notes",
      semester: "Fall 2023 Semester Notes",
      downloads: 542,
      isPopular: true,
      author: "NoteNavigator"
    },
    {
      id: 2,
      title: "Explore Your Notes",
      semester: "Fall 2023 Semester Notes",
      downloads: 542,
      isPopular: true,
      author: "NoteNavigator"
    },
    {
      id: 3,
      title: "Explore Your Notes",
      semester: "Fall 2023 Semester Notes",
      downloads: 542,
      isPopular: true,
      author: "NoteNavigator"
    },
    {
      id: 4,
      title: "Explore Your Notes",
      semester: "Fall 2023 Semester Notes",
      downloads: 542,
      isPopular: true,
      author: "NoteNavigator"
    },
    {
      id: 5,
      title: "Explore Your Notes",
      semester: "Fall 2023 Semester Notes",
      downloads: 542,
      isPopular: true,
      author: "NoteNavigator"
    }
  ];
  
  const courseNotes = [
    {
      id: 1,
      title: "NoteSync",
      subtitle: "LectureLink Hub",
      filter: "Filter Year, Semester",
      users: "2K NoteSync Users",
      isPopular: true
    },
    {
      id: 2,
      title: "NoteSync",
      subtitle: "LectureLink Hub",
      filter: "Filter Year, Semester",
      users: "2K NoteSync Users",
      isPopular: true
    },
    {
      id: 3,
      title: "NoteSync",
      subtitle: "LectureLink Hub",
      filter: "Filter Year, Semester",
      users: "2K NoteSync Users",
      isPopular: true
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Notes
                </label>
                <Input
                  id="semester"
                  placeholder="Semester Notes"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="courseYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Year
                </label>
                <Input
                  id="courseYear"
                  placeholder="Course Year"
                  value={courseYear}
                  onChange={(e) => setCourseYear(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full h-10 bg-studyhub-500 hover:bg-studyhub-600">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Browse Notes</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Most Popular</DropdownMenuItem>
                  <DropdownMenuItem>Latest Uploads</DropdownMenuItem>
                  <DropdownMenuItem>Most Downloaded</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
              {recentNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group">
                    <CardContent className="p-0 relative">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-8 w-8 bg-studyhub-100 text-studyhub-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{note.author.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium">{note.author}</span>
                        </div>
                        
                        <h3 className="font-semibold mb-1">{note.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{note.semester}</p>
                        
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          {note.isPopular && (
                            <div className="flex items-center gap-1 mr-3 text-studyhub-600">
                              <ArrowUp className="h-3 w-3" />
                              <span>Popular</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{note.downloads} notes downloads</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button variant="default" size="sm" className="text-xs px-3 py-1 h-8 bg-studyhub-500 hover:bg-studyhub-600">
                            Browse
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Course Notes</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>1 of 14</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowUp className="h-4 w-4 rotate-90" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {courseNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-studyhub-100 text-studyhub-600 rounded-md flex items-center justify-center">
                      <span className="font-medium">{note.title.charAt(0)}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{note.title}</h3>
                        <span className="text-sm text-gray-500">{note.subtitle}</span>
                      </div>
                      <p className="text-sm text-gray-500">{note.filter}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-gray-400">•</span>
                        <span>Sync Fast</span>
                        <span className="text-gray-400">•</span>
                        <span>View Course Notes</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        {note.isPopular && (
                          <div className="flex items-center gap-1 mr-3 text-studyhub-600">
                            <ArrowUp className="h-3 w-3" />
                            <span>Popular</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span>•</span>
                          <span>{note.users}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button className="bg-studyhub-500 hover:bg-studyhub-600">
                      Sync
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Browse;
