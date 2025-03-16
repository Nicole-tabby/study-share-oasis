
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavigationBar from '@/components/NavigationBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Edit, Image, Heart, MessageSquare, Bookmark, User, LogOut } from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  course?: string;
  university?: string;
  year?: string;
}

const defaultUser: UserData = {
  fullName: 'Alexandra Chen',
  email: 'alexandra.chen@mit.edu',
  bio: 'Computing Science Sophomore @ MIT',
  course: 'Computing Science',
  university: 'MIT',
  year: 'Sophomore'
};

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData>(defaultUser);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real app, you would fetch user data from API
    // For demo, we'll use localStorage or default data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          ...defaultUser,
          ...parsedUser
        });
        setEditedData({
          ...defaultUser,
          ...parsedUser
        });
      } catch (error) {
        setUserData(defaultUser);
        setEditedData(defaultUser);
      }
    } else {
      setUserData(defaultUser);
      setEditedData(defaultUser);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
    });
    navigate('/');
  };
  
  const handleSaveProfile = () => {
    setUserData(editedData);
    localStorage.setItem('user', JSON.stringify(editedData));
    setIsEditing(false);
    toast({
      title: "Profile updated successfully",
    });
  };
  
  const posts = [
    {
      id: 1,
      content: "Excited to share some snapshots from the launch of our latest innovation in AI-driven education tools. It's designed to revolutionize online learning and provide personalized pathways for every student. Check out more details in my profile! #EducationRevolution #EdTech",
      likes: 12,
      comments: 4,
      date: '2 days ago'
    },
    {
      id: 2,
      content: "Excited to share some snapshots from the launch of our latest innovation in AI-driven education tools. It's designed to revolutionize online learning and provide personalized pathways for every student. Check out more details in my profile! #EducationRevolution #EdTech",
      likes: 12,
      comments: 4,
      date: '3 days ago'
    },
    {
      id: 3,
      content: "Excited to share some snapshots from the launch of our latest innovation in AI-driven education tools. It's designed to revolutionize online learning and provide personalized pathways for every student. Check out more details in my profile! #EducationRevolution #EdTech",
      likes: 12,
      comments: 4,
      date: '4 days ago'
    }
  ];
  
  const photos = [
    "/lovable-uploads/f92f06ad-f147-4cff-9f89-4492a22989f8.png",
    "/lovable-uploads/f92f06ad-f147-4cff-9f89-4492a22989f8.png",
    "/lovable-uploads/f92f06ad-f147-4cff-9f89-4492a22989f8.png",
    "/lovable-uploads/f92f06ad-f147-4cff-9f89-4492a22989f8.png"
  ];
  
  const connections = [
    {
      id: 1,
      name: 'Jordan Harper',
      title: 'Computer Science Graduate',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Jordan Harper',
      title: 'Computer Science Graduate',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'Jordan Harper',
      title: 'Computer Science Graduate',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg'
    },
    {
      id: 4,
      name: 'Jordan Harper',
      title: 'Computer Science Graduate',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    {
      id: 5,
      name: 'Jordan Harper',
      title: 'Computer Science Graduate',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  ];
  
  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="relative w-full h-64 bg-gradient-to-r from-studyhub-500 to-studyhub-400 rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png" 
                alt="Profile cover" 
                className="w-full h-full object-cover opacity-20"
              />
              
              <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="flex items-end gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                    <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
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
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.fullName}
                    onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.email}
                    onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.university}
                    onChange={(e) => setEditedData({...editedData, university: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
                    value={editedData.course}
                    onChange={(e) => setEditedData({...editedData, course: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyhub-500"
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
                <Tabs defaultValue="posts">
                  <TabsList className="mb-6">
                    <TabsTrigger value="posts" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">Posts</TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">Notes</TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">Saved</TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-studyhub-50 data-[state=active]:text-studyhub-700">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="posts" className="mt-0">
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <motion.div 
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-xl shadow-sm p-5"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                              <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{userData.fullName}</p>
                              <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{post.content}</p>
                          
                          <div className="flex items-center text-gray-500 text-sm">
                            <button className="flex items-center gap-1 mr-4 hover:text-studyhub-600">
                              <Heart size={16} />
                              <span>{post.likes} likes</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-studyhub-600">
                              <MessageSquare size={16} />
                              <span>{post.comments} comments</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <div className="mb-4">
                        <Image className="h-12 w-12 mx-auto text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Upload your first note</h3>
                      <p className="text-gray-500 mb-4">
                        Share your study materials with classmates and help others excel
                      </p>
                      <Button className="bg-studyhub-500 hover:bg-studyhub-600">
                        Upload Notes
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <div className="mb-4">
                        <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No saved content yet</h3>
                      <p className="text-gray-500 mb-4">
                        Browse study materials and save them for later
                      </p>
                      <Button className="bg-studyhub-500 hover:bg-studyhub-600">
                        Browse Materials
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                      <div className="mb-4">
                        <User className="h-12 w-12 mx-auto text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                      <p className="text-gray-500 mb-4">
                        Your activities will appear here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4">Photos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="rounded-md w-full h-24 object-cover"
                      />
                    ))}
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4">Connections</h3>
                  <div className="space-y-4">
                    {connections.map((connection) => (
                      <div key={connection.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={connection.avatar} />
                          <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{connection.name}</p>
                          <p className="text-xs text-gray-500">{connection.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
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
