
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useNotes } from '@/hooks/useNotes';
import { useSavedNotes } from '@/hooks/useSavedNotes';
import NavigationBar from '@/components/NavigationBar';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileError from '@/components/profile/ProfileError';
// Import supabase client
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Determine if this is the current user's profile or someone else's
  const isCurrentUser = !userId || (user && userId === user.id);
  const profileUserId = isCurrentUser && user ? user.id : userId;
  
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: '',
    bio: '',
    university: '',
    course: '',
    year: 'Freshman',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Hooks
  const { useUserProfile, useUpdateProfile, useUpdateAvatar } = useProfile();
  const { useUserNotes } = useNotes();
  const { useGetSavedNotes } = useSavedNotes();
  
  // Data fetching
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useUserProfile(profileUserId);
  
  const {
    data: userNotes,
    isLoading: isNotesLoading,
    error: notesError
  } = useUserNotes(profileUserId);
  
  const {
    data: savedNotes,
    isLoading: isSavedNotesLoading,
    error: savedNotesError
  } = useGetSavedNotes(profileUserId);
  
  // Mutations
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  
  // Set up form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setEditedData({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        university: profileData.university || '',
        course: profileData.course || '',
        year: profileData.year || 'Freshman',
      });
    }
  }, [profileData]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isProfileLoading) {
      navigate('/login');
      toast({
        title: "Authentication required",
        description: "Please login to view profiles"
      });
    }
  }, [user, isProfileLoading, navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error logging out",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Update profile data
      await updateProfile.mutateAsync({
        id: user.id,
        full_name: editedData.full_name,
        bio: editedData.bio,
        university: editedData.university,
        course: editedData.course,
        year: editedData.year,
      });
      
      // Handle avatar upload if there is a new avatar
      if (avatarFile) {
        try {
          await updateAvatar.mutateAsync({
            file: avatarFile,
            userId: user.id
          });
        } catch (avatarError) {
          console.error('Error updating avatar:', avatarError);
          // Continue with profile update even if avatar update fails
          toast({
            title: "Profile updated but avatar failed",
            description: "Your profile was updated but there was an issue with the avatar upload",
            variant: "warning"
          });
        }
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setAvatarPreview(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Show loading state
  if (isProfileLoading) {
    return <ProfileLoading />;
  }
  
  // Show error state
  if (profileError || !profileData) {
    return <ProfileError error={profileError as Error} />;
  }
  
  // Calculate avatar URL or fallback
  const avatarUrl = avatarPreview || 
    profileData.avatar_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || 'User')}&background=random`;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <ProfileHeader 
              profileData={profileData}
              isCurrentUser={isCurrentUser}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              avatarUrl={avatarUrl}
              handleAvatarChange={handleAvatarChange}
            />
          </div>
          
          {isCurrentUser && isEditing ? (
            <ProfileEditForm 
              editedData={editedData}
              setEditedData={setEditedData}
              setIsEditing={setIsEditing}
              handleSaveProfile={handleSaveProfile}
              isPending={updateProfile.isPending || updateAvatar.isPending}
            />
          ) : (
            <ProfileContent 
              isCurrentUser={isCurrentUser}
              profileData={profileData}
              handleLogout={handleLogout}
              isNotesLoading={isNotesLoading}
              notesError={notesError as Error}
              userNotes={userNotes}
              isSavedNotesLoading={isSavedNotesLoading}
              savedNotesError={savedNotesError as Error}
              savedNotes={savedNotes}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
