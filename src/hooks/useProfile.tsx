
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  university: string | null;
  course: string | null;
  year: string | null;
}

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Get a user's profile
  const useUserProfile = (userId: string | undefined) => {
    return useQuery({
      queryKey: ['userProfile', userId],
      queryFn: async () => {
        if (!userId) return null;

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

        // Convert the retrieved data to match the ProfileData interface by adding any missing properties
        return {
          id: data?.id || userId,
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

  // Update a user's profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async (profileData: Partial<ProfileData>) => {
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      },
    });
  };
  
  // Handle avatar upload
  const useUpdateAvatar = () => {
    return useMutation({
      mutationFn: async ({ file, userId }: { file: File, userId: string }) => {
        // First upload the file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        // Update profile with new avatar URL
        const { data, error } = await supabase
          .from('profiles')
          .update({
            avatar_url: publicUrlData.publicUrl
          })
          .eq('id', userId)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        toast({
          title: 'Avatar updated successfully',
        });
      },
      onError: (error) => {
        toast({
          title: 'Failed to update avatar',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  return {
    useUserProfile,
    useUpdateProfile,
    useUpdateAvatar
  };
};
