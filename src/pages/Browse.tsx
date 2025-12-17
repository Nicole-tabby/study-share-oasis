import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Bookmark, BookmarkCheck, ArrowUp, ArrowDown, Clock, FileText, User, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { usePublicNotes } = useNotes();
  const { data: notes = [], isLoading, error } = usePublicNotes();

  // Extract unique semesters and courses for filter dropdowns
  const { semesters, courses } = useMemo(() => {
    const semesterSet = new Set<string>();
    const courseSet = new Set<string>();
    
    notes.forEach(note => {
      if (note.semester) semesterSet.add(note.semester);
      if (note.course) courseSet.add(note.course);
    });
    
    return {
      semesters: Array.from(semesterSet).sort(),
      courses: Array.from(courseSet).sort()
    };
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let results = [...notes];
    
    // Global search across title, description, course
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(note => 
        note.title?.toLowerCase().includes(query) ||
        note.description?.toLowerCase().includes(query) ||
        note.course?.toLowerCase().includes(query) ||
        note.semester?.toLowerCase().includes(query) ||
        note.profiles?.full_name?.toLowerCase().includes(query)
      );
    }
    
    // Filter by semester
    if (selectedSemester && selectedSemester !== 'all') {
      results = results.filter(note => note.semester === selectedSemester);
    }
    
    // Filter by course
    if (selectedCourse && selectedCourse !== 'all') {
      results = results.filter(note => note.course === selectedCourse);
    }
    
    // Sort results
    return results.sort((a, b) => {
      if (sortOrder === 'popular') {
        return (b.downloads || 0) - (a.downloads || 0);
      }
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [notes, searchQuery, selectedSemester, selectedCourse, sortOrder]);

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
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSemester('all');
    setSelectedCourse('all');
    setSortOrder('newest');
  };

  const hasActiveFilters = searchQuery || selectedSemester !== 'all' || selectedCourse !== 'all';
  
  const toggleSaveNote = (noteId: string) => {
    let updatedSavedIds: string[];
    
    if (savedNotes.includes(noteId)) {
      updatedSavedIds = savedNotes.filter(id => id !== noteId);
      toast({ title: "Note removed from saved" });
    } else {
      updatedSavedIds = [...savedNotes, noteId];
      toast({ title: "Note saved successfully" });
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
          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          >
            {/* Global Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search notes by title, description, course, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base dark:bg-gray-900 dark:border-gray-700"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest' | 'popular')}>
                <SelectTrigger className="w-[150px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </Badge>
                )}
                {selectedSemester !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Semester: {selectedSemester}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSemester('all')} />
                  </Badge>
                )}
                {selectedCourse !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Course: {selectedCourse}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCourse('all')} />
                  </Badge>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Results Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-gray-100">
                {hasActiveFilters ? 'Search Results' : 'Browse Notes'}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>
            
            {/* Notes Grid */}
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
            
            {/* Empty State */}
            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium mb-2 dark:text-gray-300">No notes found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any notes matching your search criteria. Try adjusting your filters or browse all notes.
                </p>
                <Button 
                  className="bg-studyhub-500 hover:bg-studyhub-600"
                  onClick={clearFilters}
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
