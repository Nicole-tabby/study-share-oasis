
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileNotesTab from './ProfileNotesTab';
import ProfileSavedTab from './ProfileSavedTab';
import ProfileUserInfo from './ProfileUserInfo';
import { Note } from '@/hooks/useNotes';
import { SavedNoteWithData } from '@/hooks/useSavedNotes';

interface ProfileContentProps {
  isCurrentUser: boolean;
  profileData: {
    university: string | null;
    course: string | null;
    year: string | null;
  };
  handleLogout: () => void;
  isNotesLoading: boolean;
  notesError: Error | null;
  userNotes: Note[] | undefined;
  isSavedNotesLoading: boolean;
  savedNotesError: Error | null;
  savedNotes: SavedNoteWithData[] | undefined;
}

const ProfileContent = ({
  isCurrentUser,
  profileData,
  handleLogout,
  isNotesLoading,
  notesError,
  userNotes,
  isSavedNotesLoading,
  savedNotesError,
  savedNotes
}: ProfileContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Tabs defaultValue="notes">
          <TabsList className="mb-6">
            <TabsTrigger value="notes" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">
              {isCurrentUser ? 'My Notes' : 'Notes'}
            </TabsTrigger>
            {isCurrentUser && (
              <TabsTrigger value="saved" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">
                Saved
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="notes" className="mt-0">
            <ProfileNotesTab 
              isCurrentUser={isCurrentUser}
              isNotesLoading={isNotesLoading}
              notesError={notesError}
              userNotes={userNotes}
            />
          </TabsContent>
          
          {isCurrentUser && (
            <TabsContent value="saved">
              <ProfileSavedTab 
                isSavedNotesLoading={isSavedNotesLoading}
                savedNotesError={savedNotesError}
                savedNotes={savedNotes}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      <ProfileUserInfo 
        profileData={profileData}
        isCurrentUser={isCurrentUser}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default ProfileContent;
