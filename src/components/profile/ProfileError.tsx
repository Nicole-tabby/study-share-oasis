
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import { Button } from "@/components/ui/button";

interface ProfileErrorProps {
  error?: Error;
}

const ProfileError = ({ error }: ProfileErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Profile not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error ? error.message : 'Could not find the requested profile'}
          </p>
          <Button onClick={() => navigate('/browse')}>
            Go to Browse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileError;
