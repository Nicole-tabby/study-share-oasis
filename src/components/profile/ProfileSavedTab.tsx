
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Image } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import NoteCard from '@/components/NoteCard';
import { SavedNoteWithData } from '@/hooks/useSavedNotes';

interface ProfileSavedTabProps {
  isSavedNotesLoading: boolean;
  savedNotesError: Error | null;
  savedNotes: SavedNoteWithData[] | undefined;
}

const ProfileSavedTab = ({ 
  isSavedNotesLoading, 
  savedNotesError, 
  savedNotes 
}: ProfileSavedTabProps) => {
  const navigate = useNavigate();
  
  if (isSavedNotesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }
  
  if (savedNotesError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
        <p className="text-red-500">Error loading saved notes: {savedNotesError.message}</p>
      </div>
    );
  }
  
  if (!savedNotes || savedNotes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
        <div className="mb-4">
          <Image className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No saved notes yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Browse study materials and save them for later
        </p>
        <Button 
          className="bg-studyhub-500 hover:bg-studyhub-600"
          onClick={() => navigate('/browse')}
        >
          Browse Materials
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {savedNotes.map((saved) => (
        saved.note && (
          <NoteCard 
            key={saved.id} 
            note={saved.note}
            showActions={false} 
            showUnsave
            savedId={saved.id}
          />
        )
      ))}
    </div>
  );
};

export default ProfileSavedTab;
