import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({
              ...updateData,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

          if (error) {
            console.error('Supabase update profile error:', error);
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

          return data[0];
        } catch (error) {
          console.error('Profile update error:', error);
          toast({
            title: 'Failed to update profile',
            description: error instanceof Error ? error.message : 'Unknown error occurred',
            variant: 'destructive',
          });
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
      },
    });
  };
  
  // Upload and update avatar
  const useUpdateAvatar = () => {
    return useMutation({
      mutationFn: async ({ file, userId }: { file: File, userId: string }) => {
        // Step 1: Upload the file to storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/avatar.${fileExt}`;
        
        try {
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });
          
          if (uploadError) {
            console.error('Avatar upload error:', uploadError);
            toast({
              title: 'Avatar upload failed',
              description: uploadError.message,
              variant: 'destructive',
            });
            throw uploadError;
          }
          
          // Step 2: Get the public URL
          const { data: publicURL } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          
          if (!publicURL) {
            const error = new Error('Failed to get public URL for avatar');
            toast({
              title: 'Avatar update failed',
              description: error.message,
              variant: 'destructive',
            });
            throw error;
          }
          
          // Step 3: Update the profile with the new avatar URL
          const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ 
              avatar_url: publicURL.publicUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select();
          
          if (updateError) {
            toast({
              title: 'Failed to update profile with new avatar',
              description: updateError.message,
              variant: 'destructive',
            });
            throw updateError;
          }
          
          toast({
            title: 'Avatar updated successfully',
          });
          
          return data[0];
        } catch (error) {
          console.error('Avatar update error:', error);
          toast({
            title: 'Avatar update failed',
            description: error instanceof Error ? error.message : 'Unknown error occurred',
            variant: 'destructive',
          });
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      }
    });
  };

  return {
    useUserProfile,
    useUpdateProfile,
    useUpdateAvatar,
  };
};
