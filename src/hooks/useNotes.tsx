
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Note {
  id: string;
  title: string;
  course: string;
  semester: string;
  description: string | null;
  file_name: string;
  file_url: string | null;
  downloads: number;
  views: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  profiles?: {
    id?: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useNotes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all public notes
  const usePublicNotes = () => {
    return useQuery({
      queryKey: ['publicNotes'],
      queryFn: async () => {
        // First, fetch all public notes
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:user_id (
              id, 
              full_name, 
              avatar_url
            )
          `)
          .eq('public', true)
          .order('created_at', { ascending: false });

        if (notesError) {
          toast({
            title: 'Error fetching notes',
            description: notesError.message,
            variant: 'destructive',
          });
          throw notesError;
        }
        
        return notesData || [];
      },
    });
  };

  // Fetch user's notes
  const useUserNotes = (userId: string | undefined) => {
    return useQuery({
      queryKey: ['userNotes', userId],
      queryFn: async () => {
        if (!userId) return [];
        
        const { data, error } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:user_id (
              id, 
              full_name, 
              avatar_url
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          toast({
            title: 'Error fetching your notes',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        return data || [];
      },
      enabled: !!userId,
    });
  };

  // Fetch single note
  const useSingleNote = (noteId: string | undefined) => {
    return useQuery({
      queryKey: ['note', noteId],
      queryFn: async () => {
        if (!noteId) throw new Error('Note ID is required');
        
        // Get the note first with profile information
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:user_id (
              id,
              full_name, 
              avatar_url
            )
          `)
          .eq('id', noteId)
          .maybeSingle();

        if (noteError) {
          console.error("Error fetching note:", noteError);
          toast({
            title: 'Error fetching note',
            description: noteError.message,
            variant: 'destructive',
          });
          throw noteError;
        }

        if (!noteData) {
          throw new Error('Note not found');
        }
        
        // Increment view counter
        try {
          await supabase
            .from('notes')
            .update({ views: (noteData.views || 0) + 1 })
            .eq('id', noteId);
        } catch (updateError) {
          console.error("Error updating view count:", updateError);
          // Don't throw error here, as we still want to return the note data
        }

        return noteData;
      },
      enabled: !!noteId,
    });
  };

  // Create note
  const useCreateNote = () => {
    return useMutation({
      mutationFn: async (noteData: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'downloads' | 'views'>) => {
        const { data, error } = await supabase
          .from('notes')
          .insert(noteData)
          .select()
          .single();

        if (error) {
          toast({
            title: 'Failed to create note',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Note created successfully',
          description: 'Your note has been uploaded and is now available.',
        });

        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userNotes'] });
        queryClient.invalidateQueries({ queryKey: ['publicNotes'] });
      },
    });
  };

  // Update note
  const useUpdateNote = () => {
    return useMutation({
      mutationFn: async ({ id, ...noteData }: Partial<Note> & { id: string }) => {
        const { data, error } = await supabase
          .from('notes')
          .update({ ...noteData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          toast({
            title: 'Failed to update note',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Note updated successfully',
        });

        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['userNotes'] });
        queryClient.invalidateQueries({ queryKey: ['publicNotes'] });
      },
    });
  };

  // Delete note
  const useDeleteNote = () => {
    return useMutation({
      mutationFn: async (noteId: string) => {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteId);

        if (error) {
          toast({
            title: 'Failed to delete note',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Note deleted successfully',
        });

        return true;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userNotes'] });
        queryClient.invalidateQueries({ queryKey: ['publicNotes'] });
      },
    });
  };

  // Increment download counter
  const useIncrementDownload = () => {
    return useMutation({
      mutationFn: async (noteId: string) => {
        try {
          // First, get the current count
          const { data: note, error: fetchError } = await supabase
            .from('notes')
            .select('downloads')
            .eq('id', noteId)
            .single();

          if (fetchError) {
            console.error("Error fetching download count:", fetchError);
            throw fetchError;
          }

          // Then increment it
          const { data, error: updateError } = await supabase
            .from('notes')
            .update({ downloads: (note?.downloads || 0) + 1 })
            .eq('id', noteId)
            .select()
            .single();

          if (updateError) {
            console.error("Error updating download count:", updateError);
            throw updateError;
          }

          return data;
        } catch (error) {
          console.error("Error in increment download mutation:", error);
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['note', variables] });
      },
    });
  };

  // Set up real-time subscription
  useEffect(() => {
    // Create a channel for real-time changes
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes'
      }, () => {
        // Invalidate relevant queries when changes happen
        queryClient.invalidateQueries({ queryKey: ['publicNotes'] });
        queryClient.invalidateQueries({ queryKey: ['userNotes'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    usePublicNotes,
    useUserNotes,
    useSingleNote,
    useCreateNote,
    useUpdateNote,
    useDeleteNote,
    useIncrementDownload
  };
};
