
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, ExtendedProfileData } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  university: string | null;
  course: string | null;
  year: string | null;
};

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const useUserProfile = (userId: string | undefined) => {
    return useQuery({
      queryKey: ['profile', userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error('User ID is required');
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          toast({
            title: 'Error fetching profile',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        
        // Convert to ProfileData type with safe fallbacks
        return {
          id: userId,
          full_name: data?.full_name || null,
          avatar_url: data?.avatar_url || null,
          bio: data?.bio || null,
          university: data?.university || null,
          course: data?.course || null,
          year: data?.year || null
        } as ProfileData;
      },
      enabled: !!userId,
    });
  };

  // Update user profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async (profileData: Partial<ProfileData> & { id: string }) => {
        const { id, ...updateData } = profileData;
        
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          toast({
            title: 'Failed to update profile',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Profile updated successfully',
        });

        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
      },
    });
  };

  return {
    useUserProfile,
    useUpdateProfile,
  };
};
