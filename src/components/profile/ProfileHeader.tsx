
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: {
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
  isCurrentUser: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  avatarUrl: string;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader = ({ 
  profileData, 
  isCurrentUser, 
  isEditing, 
  setIsEditing, 
  avatarUrl, 
  handleAvatarChange 
}: ProfileHeaderProps) => {
  return (
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
            
            {isCurrentUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
};

export default ProfileHeader;
