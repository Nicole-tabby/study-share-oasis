
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, SavedNote } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Note } from './useNotes';

export interface SavedNoteWithData extends SavedNote {
  note?: Note;
}

export const useSavedNotes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's saved notes
  const useGetSavedNotes = (userId: string | undefined) => {
    return useQuery({
      queryKey: ['savedNotes', userId],
      queryFn: async () => {
        if (!userId) return [];
        
        // First, get the saved notes references
        // Need to use @ts-ignore because the saved_notes table is not in the auto-generated types
        // @ts-ignore
        const { data: savedNoteRefs, error: savedNotesError } = await supabase
          .from('saved_notes')
          .select('*')
          .eq('user_id', userId);
          
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
        // @ts-ignore - Type safety for SavedNote
        const noteIds = savedNoteRefs.map((ref) => ref.note_id);
        
        // Fetch the actual notes
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .in('id', noteIds);
          
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
          // Get unique user IDs from notes
          const userIds = [...new Set(notesData.map(note => note.user_id))];
          
          // Fetch all relevant profiles in one query
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
            
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
          const notesWithProfiles = notesData.map(note => ({
            ...note,
            profiles: profilesMap[note.user_id] || null
          }));
          
          // Combine saved note references with note data
          // @ts-ignore - Type safety for SavedNote
          const result = savedNoteRefs.map((savedRef) => {
            const noteData = notesWithProfiles.find(note => note.id === savedRef.note_id);
            return {
              ...savedRef,
              note: noteData
            };
          });
          
          return result;
        }
        
        // @ts-ignore - Type safety for SavedNote
        return savedNoteRefs.map((ref) => ({ ...ref, note: null }));
      },
      enabled: !!userId,
    });
  };

  // Save a note
  const useSaveNote = () => {
    return useMutation({
      mutationFn: async ({ userId, noteId }: { userId: string; noteId: string }) => {
        // Check if the note is already saved
        // @ts-ignore
        const { data: existingData, error: checkError } = await supabase
          .from('saved_notes')
          .select('*')
          .eq('user_id', userId)
          .eq('note_id', noteId)
          .maybeSingle();
        
        if (checkError) {
          throw checkError;
        }
        
        // If already saved, don't duplicate
        if (existingData) {
          toast({
            title: 'Note already saved',
          });
          return existingData;
        }
        
        // Save the note
        // @ts-ignore
        const { data, error } = await supabase
          .from('saved_notes')
          .insert({
            user_id: userId,
            note_id: noteId
          })
          .select()
          .single();
          
        if (error) {
          toast({
            title: 'Failed to save note',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        
        toast({
          title: 'Note saved successfully',
        });
        
        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['savedNotes', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['isNoteSaved', variables.userId, variables.noteId] });
      },
    });
  };

  // Unsave a note
  const useUnsaveNote = () => {
    return useMutation({
      mutationFn: async ({ userId, noteId }: { userId: string; noteId: string }) => {
        // @ts-ignore
        const { error } = await supabase
          .from('saved_notes')
          .delete()
          .eq('user_id', userId)
          .eq('note_id', noteId);
          
        if (error) {
          toast({
            title: 'Failed to remove saved note',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        
        toast({
          title: 'Note removed from saved',
        });
        
        return true;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['savedNotes', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['isNoteSaved', variables.userId, variables.noteId] });
      },
    });
  };

  // Check if a note is saved
  const useIsNoteSaved = (userId: string | undefined, noteId: string | undefined) => {
    return useQuery({
      queryKey: ['isNoteSaved', userId, noteId],
      queryFn: async () => {
        if (!userId || !noteId) return false;
        
        // @ts-ignore
        const { data, error } = await supabase
          .from('saved_notes')
          .select('*')
          .eq('user_id', userId)
          .eq('note_id', noteId)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking if note is saved:', error);
          return false;
        }
        
        return !!data;
      },
      enabled: !!userId && !!noteId,
    });
  };

  return {
    useGetSavedNotes,
    useSaveNote,
    useUnsaveNote,
    useIsNoteSaved
  };
};
