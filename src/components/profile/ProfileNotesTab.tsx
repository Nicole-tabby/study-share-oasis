
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Upload } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/hooks/useNotes';

interface ProfileNotesTabProps {
  isCurrentUser: boolean;
  isNotesLoading: boolean;
  notesError: Error | null;
  userNotes: Note[] | undefined;
}

const ProfileNotesTab = ({ 
  isCurrentUser, 
  isNotesLoading, 
  notesError, 
  userNotes 
}: ProfileNotesTabProps) => {
  const navigate = useNavigate();
  
  if (isNotesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }
  
  if (notesError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
        <p className="text-red-500">Error loading notes</p>
      </div>
    );
  }
  
  if (!userNotes || userNotes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
        <div className="mb-4">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No notes yet</h3>
        {isCurrentUser ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Share your study materials with classmates and help others excel
            </p>
            <Button 
              className="bg-studyhub-500 hover:bg-studyhub-600"
              onClick={() => navigate('/upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Notes
            </Button>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            This user hasn't uploaded any notes yet
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {userNotes.map((note) => (
        <NoteCard 
          key={note.id} 
          note={note}
          showActions={isCurrentUser} 
        />
      ))}
    </div>
  );
};

export default ProfileNotesTab;
