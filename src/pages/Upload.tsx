
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationBar from '@/components/NavigationBar';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Upload as UploadIcon, X, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    semester: '',
    description: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  React.useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }
    
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    }
    
    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Clear file error
      if (errors.file) {
        setErrors({
          ...errors,
          file: ''
        });
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      try {
        // Get stored notes or initialize empty array
        const storedNotes = localStorage.getItem('allNotes');
        const allNotes = storedNotes ? JSON.parse(storedNotes) : [];
        
        // Get user data
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : { fullName: 'Anonymous User' };
        
        // Create new note object
        const newNote = {
          id: `note-${Date.now()}`,
          title: formData.title,
          course: formData.course,
          semester: formData.semester,
          description: formData.description,
          fileName: selectedFile?.name || 'unnamed.pdf',
          fileUrl: '#',
          downloads: 0,
          isPopular: false,
          author: user.fullName,
          authorId: 'current-user',
          date: new Date().toISOString().split('T')[0]
        };
        
        // Add to all notes
        const updatedNotes = [newNote, ...allNotes];
        localStorage.setItem('allNotes', JSON.stringify(updatedNotes));
        
        // Add to user notes
        const userNotes = localStorage.getItem('userNotes');
        const parsedUserNotes = userNotes ? JSON.parse(userNotes) : [];
        const updatedUserNotes = [newNote, ...parsedUserNotes];
        localStorage.setItem('userNotes', JSON.stringify(updatedUserNotes));
        
        toast({
          title: "Note uploaded successfully!",
          description: "Your note is now available for others to view."
        });
        
        // Navigate back after successful upload
        navigate('/browse');
      } catch (error) {
        console.error('Error saving note:', error);
        toast({
          title: "Failed to upload note",
          description: "There was a problem uploading your note. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Upload Study Notes</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back
            </Button>
          </div>
          
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base dark:text-gray-300">Note Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    placeholder="e.g. Calculus I - Integration Techniques"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 dark:bg-gray-900 dark:border-gray-700 ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course" className="text-base dark:text-gray-300">Course</Label>
                    <Input 
                      id="course"
                      name="course"
                      placeholder="e.g. MATH101"
                      value={formData.course}
                      onChange={handleChange}
                      className={`mt-1 dark:bg-gray-900 dark:border-gray-700 ${errors.course ? 'border-red-500' : ''}`}
                    />
                    {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="semester" className="text-base dark:text-gray-300">Semester</Label>
                    <Input 
                      id="semester"
                      name="semester"
                      placeholder="e.g. Fall 2023"
                      value={formData.semester}
                      onChange={handleChange}
                      className={`mt-1 dark:bg-gray-900 dark:border-gray-700 ${errors.semester ? 'border-red-500' : ''}`}
                    />
                    {errors.semester && <p className="mt-1 text-sm text-red-500">{errors.semester}</p>}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-base dark:text-gray-300">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Describe what these notes contain..."
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                
                <div>
                  <Label className="text-base dark:text-gray-300">File Upload</Label>
                  
                  {!selectedFile ? (
                    <div 
                      className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${errors.file ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      
                      <UploadIcon className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, PPT, TXT files</p>
                    </div>
                  ) : (
                    <div className="mt-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-studyhub-600 dark:text-studyhub-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-200">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {errors.file && <p className="mt-1 text-sm text-red-500">{errors.file}</p>}
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-studyhub-500 hover:bg-studyhub-600"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-5 w-5" />
                        Upload Notes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
