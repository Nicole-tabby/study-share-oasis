
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavigationBar from '@/components/NavigationBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Edit, Image, Heart, MessageSquare, Bookmark, User, LogOut, Upload, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UserData {
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  course?: string;
  university?: string;
  year?: string;
}

interface UserNote {
  id: string;
  title: string;
  description: string;
  course: string;
  date: string;
  fileName: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [savedNotes, setSavedNotes] = useState<UserNote[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setEditedData(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      // Set default user if none exists
      const defaultUser = {
        fullName: 'New User',
        email: 'user@example.com',
        bio: 'No bio yet',
        course: 'No course set',
        university: 'No university set',
        year: 'Freshman'
      };
      setUserData(defaultUser);
      setEditedData(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
    
    // Load user notes
    const storedNotes = localStorage.getItem('userNotes');
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        setUserNotes(parsedNotes);
      } catch (error) {
        console.error("Error parsing notes:", error);
        setUserNotes([]);
      }
    }
    
    // Load saved notes
    const storedSavedNotes = localStorage.getItem('savedNotes');
    if (storedSavedNotes) {
      try {
        const parsedSavedNotes = JSON.parse(storedSavedNotes);
        setSavedNotes(parsedSavedNotes);
      } catch (error) {
        console.error("Error parsing saved notes:", error);
        setSavedNotes([]);
      }
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logged out successfully",
    });
    navigate('/login');
  };
  
  const handleSaveProfile = () => {
    if (!editedData) return;
    
    // Handle avatar upload
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const updatedData = { 
            ...editedData,
            avatar: e.target.result.toString()
          };
          
          setUserData(updatedData);
          localStorage.setItem('user', JSON.stringify(updatedData));
          
          toast({
            title: "Profile picture updated successfully",
          });
        }
      };
      reader.readAsDataURL(avatarFile);
    } else {
      // Just update other profile data
      setUserData(editedData);
      localStorage.setItem('user', JSON.stringify(editedData));
    }
    
    setIsEditing(false);
    toast({
      title: "Profile updated successfully",
    });
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
  
  if (!userData || !editedData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
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
                        src={avatarPreview || userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random`} 
                        alt={userData.fullName}
                      />
                      <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
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
                    <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                    <p className="text-white/80">{userData.bio}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-4 right-4 bg-white hover:bg-gray-100"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
          
          {isEditing ? (
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
                    value={editedData.fullName}
                    onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.email}
                    onChange={(e) => setEditedData({...editedData, email: e.target.value})}
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
                    value={editedData.bio}
                    onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button className="bg-studyhub-500 hover:bg-studyhub-600" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Tabs defaultValue="notes">
                  <TabsList className="mb-6">
                    <TabsTrigger value="notes" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">My Notes</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">Saved</TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="notes" className="mt-0">
                    {userNotes.length > 0 ? (
                      <div className="space-y-4">
                        {userNotes.map((note) => (
                          <motion.div 
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5"
                          >
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{note.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{note.course}</p>
                                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{note.date}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                  <FileText size={14} />
                                  <span>{note.fileName}</span>
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 my-3 text-sm">{note.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="mb-4">
                          <FileText className="h-12 w-12 mx-auto text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Upload your first note</h3>
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
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    {savedNotes.length > 0 ? (
                      <div className="space-y-4">
                        {savedNotes.map((note) => (
                          <motion.div 
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5"
                          >
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{note.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{note.course}</p>
                                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{note.date}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                  <FileText size={14} />
                                  <span>{note.fileName}</span>
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 my-3 text-sm">{note.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="mb-4">
                          <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
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
                  
                  <TabsContent value="activity">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                      <div className="mb-4">
                        <User className="h-12 w-12 mx-auto text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Your activities will appear here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-8">
                <Card className="p-6 dark:bg-gray-800">
                  <h3 className="font-medium text-lg mb-4">Account Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">University</span>
                      <span>{userData.university || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Course</span>
                      <span>{userData.course || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Year</span>
                      <span>{userData.year || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Email</span>
                      <span>{userData.email}</span>
                    </div>
                  </div>
                </Card>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
