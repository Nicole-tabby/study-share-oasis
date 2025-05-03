
import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import { Spinner } from '@/components/Spinner';

const ProfileLoading = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    </div>
  );
};

export default ProfileLoading;
