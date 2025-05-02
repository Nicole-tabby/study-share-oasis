
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Bookmark, BookmarkCheck, ArrowUp, ArrowDown, Clock, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

interface Note {
  id: string;
  title: string;
  course: string;
  semester: string;
  description: string;
  fileName: string;
  fileUrl: string;
  downloads: number;
  isPopular: boolean;
  author: string;
  authorId: string;
  date: string;
}

const Browse = () => {
  const [semester, setSemester] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [courseName, setCourseName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check authentication and load notes
  useEffect(() => {
    if (user) {
      loadNotes();
      
      // Load saved notes IDs
      const savedIds = localStorage.getItem('savedNotesIds');
      if (savedIds) {
        try {
          setSavedNotes(JSON.parse(savedIds));
        } catch (error) {
          console.error("Error parsing saved note IDs:", error);
        }
      }
    }
  }, [user]);
  
  const loadNotes = () => {
    setIsLoading(true);
    
    // Load notes from localStorage or use sample data if none exists
    const storedNotes = localStorage.getItem('allNotes');
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
        setFilteredNotes(parsedNotes);
      } catch (error) {
        console.error("Error parsing notes:", error);
        generateSampleNotes();
      }
    } else {
      generateSampleNotes();
    }
    
    setIsLoading(false);
  };
  
  const generateSampleNotes = () => {
    const sampleNotes: Note[] = [
      {
        id: "note-1",
        title: "Introduction to Computer Science",
        course: "CS101",
        semester: "Fall 2023",
        description: "Comprehensive notes covering basic programming concepts, algorithms, and data structures.",
        fileName: "cs101_intro.pdf",
        fileUrl: "#",
        downloads: 342,
        isPopular: true,
        author: "Alex Johnson",
        authorId: "user-1",
        date: "2023-09-15"
      },
      {
        id: "note-2",
        title: "Advanced Calculus Formulas",
        course: "MATH301",
        semester: "Spring 2023",
        description: "Complete formula sheet for advanced calculus with examples and applications.",
        fileName: "calculus_formulas.pdf",
        fileUrl: "#",
        downloads: 289,
        isPopular: true,
        author: "Maria Garcia",
        authorId: "user-2",
        date: "2023-04-22"
      },
      {
        id: "note-3",
        title: "Organic Chemistry Lab Manual",
        course: "CHEM202",
        semester: "Fall 2022",
        description: "Detailed lab manual with procedures, safety guidelines, and expected results.",
        fileName: "ochem_lab.pdf",
        fileUrl: "#",
        downloads: 175,
        isPopular: false,
        author: "James Wilson",
        authorId: "user-3",
        date: "2022-11-30"
      },
      {
        id: "note-4",
        title: "World History Timeline",
        course: "HIST101",
        semester: "Spring 2023",
        description: "Comprehensive timeline of major world events from ancient civilizations to modern era.",
        fileName: "history_timeline.pdf",
        fileUrl: "#",
        downloads: 201,
        isPopular: false,
        author: "Emily Zhang",
        authorId: "user-4",
        date: "2023-03-12"
      },
      {
        id: "note-5",
        title: "Economics Principles Summary",
        course: "ECON201",
        semester: "Fall 2023",
        description: "Summary of key microeconomic and macroeconomic principles with graphs and examples.",
        fileName: "econ_summary.pdf",
        fileUrl: "#",
        downloads: 312,
        isPopular: true,
        author: "Michael Brown",
        authorId: "user-5",
        date: "2023-10-05"
      }
    ];
    
    setNotes(sampleNotes);
    setFilteredNotes(sampleNotes);
    localStorage.setItem('allNotes', JSON.stringify(sampleNotes));
  };
  
  const handleSearch = () => {
    let results = [...notes];
    
    if (semester) {
      results = results.filter(note => 
        note.semester.toLowerCase().includes(semester.toLowerCase())
      );
    }
    
    if (courseYear) {
      results = results.filter(note => 
        note.semester.toLowerCase().includes(courseYear.toLowerCase())
      );
    }
    
    if (courseName) {
      results = results.filter(note => 
        note.course.toLowerCase().includes(courseName.toLowerCase())
      );
    }
    
    const sortedResults = sortNotes(results, sortOrder);
    setFilteredNotes(sortedResults);
    
    toast({
      title: "Search completed",
      description: results.length > 0 
        ? `Found ${results.length} matching notes` 
        : "No matching notes found",
    });
  };
  
  const sortNotes = (noteList: Note[], order: 'newest' | 'oldest') => {
    return [...noteList].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
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
    
    // Update saved notes in localStorage
    const savedNotesList = notes.filter(note => updatedSavedIds.includes(note.id));
    localStorage.setItem('savedNotes', JSON.stringify(savedNotesList));
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
                >
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-0 relative">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-8 w-8 bg-studyhub-100 text-studyhub-600 dark:bg-studyhub-900 dark:text-studyhub-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{note.author.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium dark:text-gray-300">{note.author}</span>
                        </div>
                        
                        <h3 className="font-semibold mb-1 dark:text-white">{note.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{note.course}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{note.semester}</p>
                        
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                          {note.isPopular && (
                            <div className="flex items-center gap-1 mr-3 text-studyhub-600 dark:text-studyhub-400">
                              <ArrowUp className="h-3 w-3" />
                              <span>Popular</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{note.downloads} downloads</span>
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
                    setFilteredNotes(notes);
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
