
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { fetchSavedNoteRefs, fetchNotesByIds, fetchProfilesForNotes, SavedNoteWithData } from './savedNotesUtils';

export const useGetSavedNotes = (userId: string | undefined) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['savedNotes', userId],
    queryFn: async (): Promise<SavedNoteWithData[]> => {
      if (!userId) return [];
      
      // First, get the saved notes references
      const { savedNoteRefs, error: savedNotesError } = await fetchSavedNoteRefs(userId);
      
      if (savedNotesError) {
        toast({
          title: 'Error fetching saved notes',
          description: savedNotesError.message,
          variant: 'destructive',
        });
        throw savedNotesError;
      }
      
      // If there are no saved notes, return empty array
      if (!savedNoteRefs || savedNoteRefs.length === 0) {
        return [];
      }
      
      // Extract note IDs
      const noteIds = savedNoteRefs.map((ref: any) => ref.note_id);
      
      // Fetch the actual notes
      const { notesData, error: notesError } = await fetchNotesByIds(noteIds);
      
      if (notesError) {
        toast({
          title: 'Error fetching note details',
          description: notesError.message,
          variant: 'destructive',
        });
        throw notesError;
      }
      
      // If we have notes, fetch their corresponding profile data
      if (notesData && notesData.length > 0) {
        const { profilesData, error: profilesError } = await fetchProfilesForNotes(notesData);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Continue without profiles rather than failing completely
        }
        
        // Create a map of user_id to profile data for quick lookups
        const profilesMap = (profilesData || []).reduce((map: Record<string, any>, profile: any) => {
          map[profile.id] = profile;
          return map;
        }, {});
        
        // Join notes with their profile data
        const notesWithProfiles = notesData.map((note: any) => ({
          ...note,
          profiles: profilesMap[note.user_id] || null
        }));
        
        // Combine saved note references with note data
        return savedNoteRefs.map((savedRef: any) => {
          const noteData = notesWithProfiles.find((note: any) => note.id === savedRef.note_id);
          return {
            ...savedRef,
            note: noteData
          };
        });
      }
      
      // If no note data, just return saved refs with note: null
      return savedNoteRefs.map((ref: any) => ({ ...ref, note: null }));
    },
    enabled: !!userId,
  });
};
