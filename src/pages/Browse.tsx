
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Bookmark, BookmarkCheck, ArrowUp, ArrowDown, Clock, FileText, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';

const Browse = () => {
  const [semester, setSemester] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [courseName, setCourseName] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { usePublicNotes } = useNotes();
  const { data: notes = [], isLoading, error } = usePublicNotes();

  // Filter notes based on search criteria
  useEffect(() => {
    let results = [...notes];
    
    if (semester) {
      results = results.filter(note => 
        note.semester.toLowerCase().includes(semester.toLowerCase())
      );
    }
    
    if (courseYear) {
      const year = courseYear.toLowerCase();
      results = results.filter(note => 
        note.semester.toLowerCase().includes(year) || 
        note.course.toLowerCase().includes(year)
      );
    }
    
    if (courseName) {
      results = results.filter(note => 
        note.course.toLowerCase().includes(courseName.toLowerCase())
      );
    }
    
    // Sort results
    results = sortNotes(results, sortOrder);
    setFilteredNotes(results);
  }, [notes, semester, courseYear, courseName, sortOrder]);
  
  // Load saved notes from localStorage
  useEffect(() => {
    const savedIds = localStorage.getItem('savedNotesIds');
    if (savedIds) {
      try {
        setSavedNotes(JSON.parse(savedIds));
      } catch (error) {
        console.error("Error parsing saved note IDs:", error);
        setSavedNotes([]);
      }
    }
  }, []);
  
  const handleSearch = () => {
    toast({
      title: "Search results",
      description: filteredNotes.length > 0 
        ? `Found ${filteredNotes.length} matching notes` 
        : "No matching notes found",
    });
  };
  
  const sortNotes = (noteList: any[], order: 'newest' | 'oldest') => {
    return [...noteList].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };
  
  const handleSort = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    setFilteredNotes(sortNotes(filteredNotes, order));
    
    toast({
      title: "Notes sorted",
      description: `Displaying ${order === 'newest' ? 'newest' : 'oldest'} notes first`,
    });
  };
  
  const toggleSaveNote = (noteId: string) => {
    let updatedSavedIds: string[];
    
    if (savedNotes.includes(noteId)) {
      updatedSavedIds = savedNotes.filter(id => id !== noteId);
      toast({
        title: "Note removed from saved",
      });
    } else {
      updatedSavedIds = [...savedNotes, noteId];
      toast({
        title: "Note saved successfully",
      });
    }
    
    setSavedNotes(updatedSavedIds);
    localStorage.setItem('savedNotesIds', JSON.stringify(updatedSavedIds));
  };
  
  const handleViewNote = (noteId: string) => {
    navigate(`/note/${noteId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-studyhub-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            <h3 className="font-medium">Error loading notes</h3>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-studyhub-500 hover:bg-studyhub-600"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester
                </label>
                <Input
                  id="semester"
                  placeholder="e.g. Fall 2023"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              
              <div>
                <label htmlFor="courseYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Year
                </label>
                <Input
                  id="courseYear"
                  placeholder="e.g. 2023"
                  value={courseYear}
                  onChange={(e) => setCourseYear(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              
              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Name
                </label>
                <Input
                  id="courseName"
                  placeholder="e.g. CS101"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700"
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
              <h2 className="text-xl font-semibold dark:text-gray-100">Browse Notes</h2>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 dark:border-gray-700 dark:bg-gray-800">
                      <Filter className="h-4 w-4" />
                      Sort by
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuItem onClick={() => handleSort('newest')} className="flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700">
                      <ArrowDown className="h-4 w-4" />
                      Newest first
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('oldest')} className="flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-700">
                      <ArrowUp className="h-4 w-4" />
                      Oldest first
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredNotes.length} notes
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-0 relative">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-8 w-8 bg-studyhub-100 text-studyhub-600 dark:bg-studyhub-900 dark:text-studyhub-300 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium dark:text-gray-300">
                            {note.profiles?.full_name || 'User'}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold mb-1 dark:text-white line-clamp-2">{note.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{note.course}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{note.semester}</p>
                        
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                          {note.downloads > 100 && (
                            <div className="flex items-center gap-1 mr-3 text-studyhub-600 dark:text-studyhub-400">
                              <ArrowUp className="h-3 w-3" />
                              <span>Popular</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{note.downloads || 0} downloads</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="text-xs px-3 py-1 h-8 bg-studyhub-500 hover:bg-studyhub-600 flex items-center gap-1"
                            onClick={() => handleViewNote(note.id)}
                          >
                            <FileText className="h-3 w-3" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => toggleSaveNote(note.id)}
                          >
                            {savedNotes.includes(note.id) ? (
                              <BookmarkCheck className="h-4 w-4 text-studyhub-500" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium mb-2 dark:text-gray-300">No notes found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any notes matching your search criteria. Try adjusting your filters or browse all notes.
                </p>
                <Button 
                  className="bg-studyhub-500 hover:bg-studyhub-600"
                  onClick={() => {
                    setSemester('');
                    setCourseYear('');
                    setCourseName('');
                  }}
                >
                  View All Notes
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Browse;
