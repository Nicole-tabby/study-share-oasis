import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavigationBar from '@/components/NavigationBar';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Download, FileText, Eye, Trash2, BookmarkPlus, BookmarkX } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedNotes } from '@/hooks/useSavedNotes';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ViewNote = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { useSingleNote, useIncrementDownload, useDeleteNote } = useNotes();
  const { data: note, isLoading, error } = useSingleNote(noteId);
  const incrementDownload = useIncrementDownload();
  const deleteNote = useDeleteNote();

  const { useIsNoteSaved, useSaveNote, useUnsaveNote } = useSavedNotes();
  const { data: isNoteSaved, isLoading: isCheckingSaved } = useIsNoteSaved(user?.id, noteId);
  const saveNote = useSaveNote();
  const unsaveNote = useUnsaveNote();

  // Generate download URL when note data is available
  useEffect(() => {
    const getDownloadUrl = async () => {
      if (!note?.file_url) return;
      
      try {
        // Check if file_url is already a complete URL
        if (note.file_url.startsWith('http')) {
          setDownloadUrl(note.file_url);
          return;
        }
        
        console.log('Attempting to get signed URL for:', note.file_url);
        
        // Get a signed URL from storage for the file
        const { data, error } = await supabase.storage
          .from('notes')
          .createSignedUrl(note.file_url, 60 * 60); // 1 hour expiry
          
        if (error) {
          console.error('Error creating signed URL:', error);
          
          // Try alternative approach - download URL
          const downloadData = await supabase.storage
            .from('notes')
            .getPublicUrl(note.file_url);
            
          if (downloadData.data?.publicUrl) {
            console.log("Successfully created public URL:", downloadData.data.publicUrl);
            setDownloadUrl(downloadData.data.publicUrl);
            return;
          }
          
          toast({
            title: "Error accessing file",
            description: "There was a problem accessing this note. The file may not exist or may have been moved.",
            variant: "destructive"
          });
          return;
        }
        
        if (data?.signedUrl) {
          console.log("Successfully created signed URL:", data.signedUrl);
          setDownloadUrl(data.signedUrl);
        }
      } catch (err) {
        console.error('Error processing download URL:', err);
        toast({
          title: "Error accessing file",
          description: "There was a problem accessing this note. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    if (note) {
      getDownloadUrl();
    }
  }, [note, toast]);

  const handleDownload = async () => {
    if (!note) return;
    
    try {
      // Try to get the latest download URL if we don't have one
      if (!downloadUrl && note.file_url) {
        // Try public URL first
        const { data } = await supabase.storage
          .from('notes')
          .getPublicUrl(note.file_url);
          
        if (data?.publicUrl) {
          setDownloadUrl(data.publicUrl);
        }
      }
      
      // If we still don't have a download URL, show an error
      if (!downloadUrl) {
        toast({
          title: "Download failed",
          description: "Unable to generate download link. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Increment the download counter
      await incrementDownload.mutateAsync(note.id);
      
      toast({
        title: "Download started",
        description: "Your file download has started"
      });
      
      // Create an anchor element and simulate click to download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = note.file_name || 'study-note';
      link.target = '_blank'; // Open in new tab to handle potential cross-origin issues
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        toast({
          title: "Note downloaded",
          description: `${note.file_name} has been downloaded successfully.`
        });
      }, 1500);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = async () => {
    if (!note) return;
    
    try {
      await deleteNote.mutateAsync(note.id);
      navigate('/browse', { replace: true });
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveNote = async () => {
    if (!user || !noteId) return;
    await saveNote.mutateAsync({
      userId: user.id,
      noteId: noteId
    });
  };

  const handleUnsaveNote = async () => {
    if (!user || !noteId) return;
    await unsaveNote.mutateAsync({
      userId: user.id,
      noteId: noteId
    });
  };

  const isOwner = user?.id === note?.user_id;

  // Only redirect to login if accessing private notes without authentication
  useEffect(() => {
    if (!isLoading && !user && note && note.public === false) {
      navigate('/login');
      toast({
        title: "Authentication required",
        description: "Please login to view private notes"
      });
    }
  }, [user, isLoading, navigate, toast, note]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center flex-1">
          <div className="animate-spin h-8 w-8 border-4 border-studyhub-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/browse')}
            className="mb-6 dark:border-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
          </Button>
          
          <Card className="p-8 text-center dark:bg-gray-800">
            <FileText className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Note not found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The study note you're looking for doesn't exist or may have been removed.
            </p>
            <Button onClick={() => navigate('/browse')} className="bg-studyhub-500 hover:bg-studyhub-600">
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
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/browse')}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
            </Button>
            
            {isOwner && (
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Note
              </Button>
            )}
          </div>
          
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-studyhub-100 text-studyhub-600 dark:bg-studyhub-900 dark:text-studyhub-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium">
                  {(note?.profiles?.full_name || 'User').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold dark:text-white">{note?.title}</h2>
                  <Badge variant="outline" className="bg-studyhub-50 text-studyhub-700 border-studyhub-200 dark:bg-studyhub-900 dark:text-studyhub-300 dark:border-studyhub-800">
                    <Eye className="mr-1 h-3 w-3" /> {note?.public ? "Public Note" : "Private Note"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded by {note?.profiles?.full_name || 'User'} • {note ? new Date(note.created_at).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {note?.description || "No description provided"}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</h4>
                    <p className="dark:text-gray-200">{note?.course}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester</h4>
                    <p className="dark:text-gray-200">{note?.semester}</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-8 w-8 text-studyhub-500" />
                  <div>
                    <p className="font-medium dark:text-gray-200">{note?.file_name}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                      <span>{note?.downloads || 0} downloads</span>
                      <span>•</span>
                      <span>{note?.views || 1} views</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDownload} 
                  className="mt-auto bg-studyhub-500 hover:bg-studyhub-600"
                  disabled={incrementDownload.isPending}
                >
                  {incrementDownload.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Note
                    </>
                  )}
                </Button>

                {user && note && user.id !== note.user_id && (
                  <div className="mt-4">
                    {!isNoteSaved ? (
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleSaveNote}
                        disabled={saveNote.isPending || isCheckingSaved}
                      >
                        <BookmarkPlus size={16} />
                        Save Note
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleUnsaveNote}
                        disabled={unsaveNote.isPending || isCheckingSaved}
                      >
                        <BookmarkX size={16} />
                        Unsave Note
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Document Preview Section */}
            {downloadUrl && (
              <div className="mt-8 border rounded-lg overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Document Preview</h3>
                </div>
                <div className="h-[500px]">
                  {downloadUrl.endsWith('.pdf') ? (
                    <iframe 
                      src={`${downloadUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-full" 
                      title="PDF Preview" 
                      sandbox="allow-same-origin allow-scripts"
                    />
                  ) : downloadUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <div className="flex items-center justify-center h-full p-4">
                      <img 
                        src={downloadUrl} 
                        alt="Document Preview" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <FileText className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">Preview not available for this file type</p>
                      <p className="text-sm text-gray-400">Download the file to view its contents</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your note. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-red-600 hover:bg-red-700">
              {deleteNote.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : "Delete Note"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewNote;
