
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface ProfileEditFormProps {
  editedData: {
    full_name: string;
    bio: string;
    university: string;
    course: string;
    year: string;
  };
  setEditedData: (data: {
    full_name: string;
    bio: string;
    university: string;
    course: string;
    year: string;
  }) => void;
  setIsEditing: (isEditing: boolean) => void;
  handleSaveProfile: () => void;
  isPending: boolean;
}

const ProfileEditForm = ({ 
  editedData, 
  setEditedData, 
  setIsEditing, 
  handleSaveProfile,
  isPending 
}: ProfileEditFormProps) => {
  return (
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
            <option value="">Select Year</option>
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
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileEditForm;
