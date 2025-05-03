
import { useQuery } from '@tanstack/react-query';
import { fetchSavedNotes } from './savedNotesUtils';

export const useGetSavedNotes = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['savedNotes', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await fetchSavedNotes(userId);
      
      if (error) {
        console.error('Error fetching saved notes:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userId,
  });
};
