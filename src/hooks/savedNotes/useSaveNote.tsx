
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { saveNote } from './savedNotesUtils';

export const useSaveNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, noteId }: { userId: string; noteId: string }) => {
      const { data, error } = await saveNote(userId, noteId);
      
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
