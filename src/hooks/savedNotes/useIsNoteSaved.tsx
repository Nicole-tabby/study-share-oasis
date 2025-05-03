
import { useQuery } from '@tanstack/react-query';
import { checkIfNoteSaved } from './savedNotesUtils';

export const useIsNoteSaved = (userId: string | undefined, noteId: string | undefined) => {
  return useQuery({
    queryKey: ['isNoteSaved', userId, noteId],
    queryFn: async () => {
      if (!userId || !noteId) return false;
      
      const { data, error } = await checkIfNoteSaved(userId, noteId);
      
      if (error) {
        console.error('Error checking if note is saved:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!userId && !!noteId,
  });
};
