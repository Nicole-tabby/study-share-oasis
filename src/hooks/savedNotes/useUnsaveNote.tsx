
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { unsaveNote } from './savedNotesUtils';

export const useUnsaveNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, noteId }: { userId: string; noteId: string }) => {
      const { data, error } = await unsaveNote(userId, noteId);
        
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
