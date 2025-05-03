
import React, { useState } from 'react';
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

  const handleDownload = () => {
    if (!note) return;
    
    incrementDownload.mutate(note.id);
    
    toast({
      title: "Download started",
      description: "Your file download has started"
    });
    
    // In a real app, this would download the actual file
    // For this demo, we'll just simulate a download
    setTimeout(() => {
      toast({
        title: "Note downloaded",
        description: `${note.file_name} has been downloaded successfully.`
      });
    }, 1500);
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
                  {(note.profiles?.full_name || 'User').charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold dark:text-white">{note.title}</h2>
                  <Badge variant="outline" className="bg-studyhub-50 text-studyhub-700 border-studyhub-200 dark:bg-studyhub-900 dark:text-studyhub-300 dark:border-studyhub-800">
                    <Eye className="mr-1 h-3 w-3" /> {note.public ? "Public Note" : "Private Note"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded by {note.profiles?.full_name || 'User'} • {new Date(note.created_at).toLocaleDateString()}
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
                    <p className="font-medium dark:text-gray-200">{note.file_name}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                      <span>{note.downloads || 0} downloads</span>
                      <span>•</span>
                      <span>{note.views || 1} views</span>
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
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      {user && note && user.id !== note.user_id && (
        <>
          {!isNoteSaved ? (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleSaveNote}
              disabled={saveNote.isPending || isCheckingSaved}
            >
              <BookmarkPlus size={16} />
              Save Note
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleUnsaveNote}
              disabled={unsaveNote.isPending || isCheckingSaved}
            >
              <BookmarkX size={16} />
              Unsave Note
            </Button>
          )}
        </>
      )}
      
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
