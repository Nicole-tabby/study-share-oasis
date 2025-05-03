
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, BookmarkX, Download, Eye, FileText, Trash2 } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedNotes } from '@/hooks/useSavedNotes';
import { format, parseISO } from 'date-fns';

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
  showUnsave?: boolean;
  savedId?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  showActions = false, 
  showUnsave = false,
  savedId,
}) => {
  const { user } = useAuth();
  const { useSaveNote, useUnsaveNote } = useSavedNotes();
  const saveNote = useSaveNote();
  const unsaveNote = useUnsaveNote();
  
  // Format the date
  const formattedDate = note.created_at ? 
    format(parseISO(note.created_at), 'MMM dd, yyyy') : 
    'Unknown date';
  
  const handleSave = async () => {
    if (!user) return;
    await saveNote.mutateAsync({
      userId: user.id,
      noteId: note.id
    });
  };
  
  const handleUnsave = async () => {
    if (!user) return;
    await unsaveNote.mutateAsync({
      userId: user.id,
      noteId: note.id
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5"
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <Link to={`/note/${note.id}`}>
            <h3 className="font-semibold text-lg hover:text-studyhub-500 transition-colors">
              {note.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-gray-600 dark:text-gray-400 text-sm">{note.course}</p>
            <span className="text-gray-400 mx-1">•</span>
            <p className="text-gray-500 dark:text-gray-500 text-sm">{note.semester}</p>
          </div>
          <div className="flex items-center mt-2">
            <Link to={`/profile/${note.user_id}`} className="flex items-center hover:underline group">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage 
                  src={note.profiles?.avatar_url || `https://ui-avatars.com/api/?name=U&background=random`} 
                />
                <AvatarFallback>{(note.profiles?.full_name?.[0] || 'U')}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-studyhub-500">
                {note.profiles?.full_name || 'Anonymous'}
              </span>
            </Link>
            <span className="text-gray-400 mx-1">•</span>
            <p className="text-gray-500 dark:text-gray-500 text-xs">{formattedDate}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex gap-1 items-center" asChild>
              <Link to={`/note/${note.id}`}>
                <FileText size={14} />
                <span className="hidden sm:inline">View</span>
              </Link>
            </Button>
            
            {user && user.id !== note.user_id && !showUnsave && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1 items-center"
                onClick={handleSave}
                disabled={saveNote.isPending}
              >
                <BookmarkPlus size={14} />
                <span className="hidden sm:inline">Save</span>
              </Button>
            )}
            
            {showUnsave && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1 items-center text-red-500 hover:text-red-600"
                onClick={handleUnsave}
                disabled={unsaveNote.isPending}
              >
                <BookmarkX size={14} />
                <span className="hidden sm:inline">Unsave</span>
              </Button>
            )}
            
            {showActions && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1 items-center text-red-500 hover:text-red-600"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>
          
          <div className="mt-2 flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <span className="flex items-center mr-3">
              <Download className="h-3 w-3 mr-1" />
              {note.downloads || 0}
            </span>
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {note.views || 0}
            </span>
          </div>
        </div>
      </div>
      
      {note.description && (
        <p className="text-gray-700 dark:text-gray-300 my-3 text-sm">{note.description}</p>
      )}
    </motion.div>
  );
};

export default NoteCard;
