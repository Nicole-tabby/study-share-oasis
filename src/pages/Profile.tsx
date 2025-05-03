import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavigationBar from '@/components/NavigationBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Edit, Image, FileText, LogOut, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useNotes } from '@/hooks/useNotes';
import { useSavedNotes } from '@/hooks/useSavedNotes';
import { format } from 'date-fns';
import NoteCard from '@/components/NoteCard';
import { Spinner } from '@/components/Spinner';
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
    if (!user) return;
    
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
        await updateAvatar.mutateAsync({
          file: avatarFile,
          userId: user.id
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  // Show error state
  if (profileError || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Profile not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {profileError ? (profileError as Error).message : 'Could not find the requested profile'}
            </p>
            <Button onClick={() => navigate('/browse')}>
              Go to Browse
            </Button>
          </div>
        </div>
      </div>
    );
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
            <div className="relative w-full h-64 bg-gradient-to-r from-studyhub-500 to-studyhub-400 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-opacity-70 bg-studyhub-600"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="flex items-end gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md bg-white">
                      <AvatarImage 
                        src={avatarUrl} 
                        alt={profileData.full_name || 'User'}
                      />
                      <AvatarFallback>{(profileData.full_name || 'User').charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {isCurrentUser && isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <Edit className="h-6 w-6 text-white" />
                          <span className="sr-only">Upload profile picture</span>
                          <Input 
                            id="avatar-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-white">
                    <h1 className="text-2xl font-bold">{profileData.full_name || 'User'}</h1>
                    <p className="text-white/80">{profileData.bio}</p>
                  </div>
                </div>
              </div>
              
              {isCurrentUser && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-4 right-4 bg-white hover:bg-gray-100"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              )}
            </div>
          </div>
          
          {isCurrentUser && isEditing ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.full_name}
                    onChange={(e) => setEditedData({...editedData, full_name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.university}
                    onChange={(e) => setEditedData({...editedData, university: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.course}
                    onChange={(e) => setEditedData({...editedData, course: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.year}
                    onChange={(e) => setEditedData({...editedData, year: e.target.value})}
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    rows={3}
                    value={editedData.bio || ''}
                    onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-studyhub-500 hover:bg-studyhub-600" 
                  onClick={handleSaveProfile}
                  disabled={updateProfile.isPending || updateAvatar.isPending}
                >
                  {(updateProfile.isPending || updateAvatar.isPending) ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Tabs defaultValue="notes">
                  <TabsList className="mb-6">
                    <TabsTrigger value="notes" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">
                      {isCurrentUser ? 'My Notes' : 'Notes'}
                    </TabsTrigger>
                    {isCurrentUser && (
                      <TabsTrigger value="saved" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">
                        Saved
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="notes" className="mt-0">
                    {isNotesLoading ? (
                      <div className="flex justify-center py-8">
                        <Spinner />
                      </div>
                    ) : notesError ? (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <p className="text-red-500">Error loading notes</p>
                      </div>
                    ) : userNotes && userNotes.length > 0 ? (
                      <div className="space-y-4">
                        {userNotes.map((note) => (
                          <NoteCard 
                            key={note.id} 
                            note={note}
                            showActions={isCurrentUser} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="mb-4">
                          <FileText className="h-12 w-12 mx-auto text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                        {isCurrentUser ? (
                          <>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                              Share your study materials with classmates and help others excel
                            </p>
                            <Button 
                              className="bg-studyhub-500 hover:bg-studyhub-600"
                              onClick={() => navigate('/upload')}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Notes
                            </Button>
                          </>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            This user hasn't uploaded any notes yet
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  {isCurrentUser && (
                    <TabsContent value="saved">
                      {isSavedNotesLoading ? (
                        <div className="flex justify-center py-8">
                          <Spinner />
                        </div>
                      ) : savedNotesError ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                          <p className="text-red-500">Error loading saved notes</p>
                        </div>
                      ) : savedNotes && savedNotes.length > 0 ? (
                        <div className="space-y-4">
                          {savedNotes.map((saved) => (
                            saved.note && (
                              <NoteCard 
                                key={saved.id} 
                                note={saved.note}
                                showActions={false} 
                                showUnsave
                                savedId={saved.id}
                              />
                            )
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                          <div className="mb-4">
                            <Image className="h-12 w-12 mx-auto text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No saved notes yet</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Browse study materials and save them for later
                          </p>
                          <Button 
                            className="bg-studyhub-500 hover:bg-studyhub-600"
                            onClick={() => navigate('/browse')}
                          >
                            Browse Materials
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </div>
              
              <div className="space-y-8">
                <Card className="p-6 dark:bg-gray-800">
                  <h3 className="font-medium text-lg mb-4">User Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">University</span>
                      <span>{profileData.university || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Course</span>
                      <span>{profileData.course || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Year</span>
                      <span>{profileData.year || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Joined</span>
                      <span>{format(new Date(), 'MMM yyyy')}</span>
                    </div>
                  </div>
                </Card>
                
                {isCurrentUser && (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
