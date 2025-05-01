
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavigationBar from '@/components/NavigationBar';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Download, FileText, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
  views: number;
}

const ViewNote = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch note data
    const storedNotes = localStorage.getItem('allNotes');
    if (storedNotes && noteId) {
      try {
        const allNotes = JSON.parse(storedNotes);
        const foundNote = allNotes.find((n: Note) => n.id === noteId);
        
        if (foundNote) {
          // Add view counter if not present
          if (!foundNote.views) {
            foundNote.views = 0;
          }
          
          // Increment view counter
          foundNote.views += 1;
          
          // Update note in localStorage
          const updatedNotes = allNotes.map((n: Note) => {
            if (n.id === noteId) {
              return { ...foundNote };
            }
            return n;
          });
          
          localStorage.setItem('allNotes', JSON.stringify(updatedNotes));
          
          setNote(foundNote);
        } else {
          toast({
            title: "Note not found",
            description: "The note you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast({
          title: "Error",
          description: "There was a problem loading this note",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [noteId, navigate, toast]);

  const handleDownload = () => {
    if (!note) return;
    
    // Increment download counter
    const storedNotes = localStorage.getItem('allNotes');
    if (storedNotes) {
      try {
        const allNotes = JSON.parse(storedNotes);
        const updatedNotes = allNotes.map((n: Note) => {
          if (n.id === noteId) {
            return { ...n, downloads: (n.downloads || 0) + 1 };
          }
          return n;
        });
        
        localStorage.setItem('allNotes', JSON.stringify(updatedNotes));
        
        // Update current note state
        setNote(prev => prev ? { ...prev, downloads: (prev.downloads || 0) + 1 } : null);
        
        toast({
          title: "Download started",
          description: "Your file download has started"
        });
        
        // In a real app, this would download the actual file
        // For this demo, we'll just simulate a download
        setTimeout(() => {
          toast({
            title: "Note downloaded",
            description: `${note.fileName} has been downloaded successfully.`
          });
        }, 1500);
      } catch (error) {
        console.error("Error updating download count:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center flex-1">
          <div className="animate-spin h-8 w-8 border-4 border-studyhub-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-6 dark:border-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Card className="p-8 text-center dark:bg-gray-800">
            <FileText className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Note not found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The study note you're looking for doesn't exist or may have been removed.
            </p>
            <Button onClick={() => navigate('/browse')}>
              Browse other notes
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
          
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-studyhub-100 text-studyhub-600 dark:bg-studyhub-900 dark:text-studyhub-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium">{note.author.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold dark:text-white">{note.title}</h2>
                  <Badge variant="outline" className="bg-studyhub-50 text-studyhub-700 border-studyhub-200 dark:bg-studyhub-900 dark:text-studyhub-300 dark:border-studyhub-800">
                    <Eye className="mr-1 h-3 w-3" /> Public Note
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded by {note.author} • {new Date(note.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {note.description || "No description provided"}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</h4>
                    <p className="dark:text-gray-200">{note.course}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester</h4>
                    <p className="dark:text-gray-200">{note.semester}</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-8 w-8 text-studyhub-500" />
                  <div>
                    <p className="font-medium dark:text-gray-200">{note.fileName}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                      <span>{note.downloads} downloads</span>
                      <span>•</span>
                      <span>{note.views || 1} views</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDownload} 
                  className="mt-auto bg-studyhub-500 hover:bg-studyhub-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Note
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ViewNote;
