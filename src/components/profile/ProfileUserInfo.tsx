
import React from 'react';
import { Card } from "@/components/ui/card";
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface ProfileUserInfoProps {
  profileData: {
    university: string | null;
    course: string | null;
    year: string | null;
  };
  isCurrentUser: boolean;
  handleLogout: () => void;
}

const ProfileUserInfo = ({ profileData, isCurrentUser, handleLogout }: ProfileUserInfoProps) => {
  return (
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
  );
};

export default ProfileUserInfo;
