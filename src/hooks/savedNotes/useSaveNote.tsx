
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { checkIfNoteSaved } from './savedNotesUtils';

export const useSaveNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, noteId }: { userId: string; noteId: string }) => {
      // Check if the note is already saved
      const { data: existingData, error: checkError } = await checkIfNoteSaved(userId, noteId);
      
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
