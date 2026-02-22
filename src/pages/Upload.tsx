
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
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const NoteFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  course: z.string().trim().min(1, 'Course is required').max(100, 'Course must be under 100 characters'),
  semester: z.string().trim().min(1, 'Semester is required').max(50, 'Semester must be under 50 characters'),
  description: z.string().max(2000, 'Description must be under 2000 characters').optional(),
});

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { useCreateNote } = useNotes();
  const createNote = useCreateNote();
  
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    semester: '',
    description: '',
    isPublic: true
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate with zod schema
    const result = NoteFormSchema.safeParse({
      title: formData.title,
      course: formData.course,
      semester: formData.semester,
      description: formData.description || undefined,
    });

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isPublic: checked
    });
  };
  
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/markdown',
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT, MD' }));
        e.target.value = '';
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, file: 'File is too large. Maximum size is 10MB.' }));
        e.target.value = '';
        return;
      }

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      toast({
        title: "Please fix the errors",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `notes/${user.id}/${fileName}`;
      
      // Simulate file upload
      // In production, use actual Supabase storage:
      // const { error: uploadError } = await supabase.storage
      //   .from('notes')
      //   .upload(filePath, selectedFile);
      
      // if (uploadError) throw uploadError;
      
      // 2. Create note in database
      await createNote.mutateAsync({
        title: formData.title,
        course: formData.course,
        semester: formData.semester,
        description: formData.description || null,
        file_name: selectedFile.name,
        file_url: filePath,
        user_id: user.id,
        public: formData.isPublic
      });
      
      // Navigate to the browse page after successful upload
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
              onClick={() => navigate('/browse')}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back to Browse
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
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="public" 
                    checked={formData.isPublic}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="public" className="dark:text-gray-300">Make this note public</Label>
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
                    disabled={isUploading || createNote.isPending}
                  >
                    {isUploading || createNote.isPending ? (
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
