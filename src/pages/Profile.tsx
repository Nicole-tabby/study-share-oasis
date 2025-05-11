
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationBar from '@/components/NavigationBar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useNotes } from '@/hooks/useNotes';
import { useSavedNotes } from '@/hooks/useSavedNotes';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileError from '@/components/profile/ProfileError';

const Profile = () => {
  const { userId: profileUserId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: '',
    bio: '',
    university: '',
    course: '',
    year: ''
  });
  
  // Get profile hooks
  const { useUserProfile, useUpdateProfile, useUpdateAvatar } = useProfile();
  
  // Get logged in user's ID or the ID from URL
  const targetUserId = profileUserId || user?.id;
  
  // Fetch profile data
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    error: profileError,
    refetch: refetchProfile
  } = useUserProfile(targetUserId);
  
  // Profile update mutations
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  
  // Notes hooks
  const { useUserNotes } = useNotes();
  const { 
    data: userNotes, 
    isLoading: isNotesLoading, 
    error: notesError 
  } = useUserNotes(targetUserId);
  
  // Saved notes hooks (only for current user)
  const { useGetSavedNotes } = useSavedNotes();
  const { 
    data: savedNotes, 
    isLoading: isSavedNotesLoading, 
    error: savedNotesError 
  } = useGetSavedNotes(user?.id);

  // Initialize editedData when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setEditedData({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        university: profileData.university || '',
        course: profileData.course || '',
        year: profileData.year || ''
      });
    }
  }, [profileData]);
  
  // Determine if profile belongs to current user
  const isCurrentUser = user?.id === targetUserId;
  
  // Redirect to login if not authorized
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/profile' } });
      toast({
        title: "Authentication required",
        description: "Please login to view profiles"
      });
    }
  }, [user, authLoading, navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleProfileUpdate = async (data: any) => {
    if (!user) return;
    
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        ...data
      });
      
      setIsEditing(false);
      refetchProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    }
  };
  
  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
      toast({
        title: "Uploading avatar...",
        description: "Please wait while we upload your new avatar.",
        duration: 3000,
      });
      
      await updateAvatar.mutateAsync({
        file,
        userId: user.id
      });
      
      refetchProfile();
    } catch (error) {
      console.error('Avatar update error:', error);
      toast({
        title: "Avatar update failed",
        description: error instanceof Error ? error.message : "Failed to update avatar",
        variant: "destructive"
      });
    }
  };
  
  // Show loading state
  if (authLoading || isProfileLoading) {
    return <ProfileLoading />;
  }
  
  // Show error state
  if (profileError || !profileData) {
    const errorMessage = profileError instanceof Error 
      ? profileError.message 
      : "Profile not found";
      
    return (
      <ProfileError 
        error={{ message: errorMessage }}
        onRetry={() => refetchProfile()}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        {isEditing ? (
          <ProfileEditForm
            editedData={editedData}
            setEditedData={setEditedData}
            setIsEditing={setIsEditing}
            handleSaveProfile={() => handleProfileUpdate(editedData)}
            isPending={updateProfile.isPending}
          />
        ) : (
          <>
            <ProfileHeader
              profileData={profileData}
              isCurrentUser={isCurrentUser}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              avatarUrl={profileData.avatar_url || ''}
              handleAvatarChange={handleAvatarUpdate}
            />
            
            <div className="mt-8">
              <ProfileContent
                isCurrentUser={isCurrentUser}
                profileData={profileData}
                handleLogout={handleLogout}
                isNotesLoading={isNotesLoading}
                notesError={notesError}
                userNotes={userNotes}
                isSavedNotesLoading={isSavedNotesLoading}
                savedNotesError={savedNotesError}
                savedNotes={savedNotes}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
