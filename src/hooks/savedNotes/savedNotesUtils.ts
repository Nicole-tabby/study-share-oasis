
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/hooks/useNotes';

// Define the SavedNote interface
export interface SavedNote {
  id: string;
  user_id: string;
  note_id: string;
  created_at: string;
}

// Define the SavedNoteWithData interface that includes the actual note data
export interface SavedNoteWithData extends SavedNote {
  note: Note | null;
}

// Utility function to fetch saved notes data
export const fetchSavedNotes = async (userId: string) => {
  try {
    // First, get the saved notes references
    // We need to use @ts-ignore because the saved_notes table isn't in the auto-generated types
    // @ts-ignore - Type safety for saved_notes table
    const { data: savedNoteRefs, error: savedNotesError } = await supabase
      .from('saved_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (savedNotesError) {
      throw savedNotesError;
    }
    
    if (!savedNoteRefs || savedNoteRefs.length === 0) {
      return { data: [], error: null };
    }
    
    // Extract note IDs from the saved references
    // Cast savedNoteRefs to SavedNote[] to help TypeScript understand the structure
    const noteIds = (savedNoteRefs as unknown as SavedNote[]).map((ref) => ref.note_id);
    
    // Fetch the actual notes
    const { data: notesData, error: notesError } = await supabase
      .from('notes')
      .select('*, profiles:user_id(*)')
      .in('id', noteIds);
      
    if (notesError) {
      throw notesError;
    }
    
    // Combine saved note references with note data
    const result = (savedNoteRefs as unknown as SavedNote[]).map((savedRef) => {
      const noteData = notesData?.find(note => note.id === savedRef.note_id);
      return {
        ...savedRef,
        note: noteData || null
      };
    });
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Utility function to check if a note is saved by a user
export const checkIfNoteSaved = async (userId: string, noteId: string) => {
  try {
    // @ts-ignore - Type safety for saved_notes table
    const { data, error } = await supabase
      .from('saved_notes')
      .select('id')
      .eq('user_id', userId)
      .eq('note_id', noteId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Utility function to save a note for a user
export const saveNote = async (userId: string, noteId: string) => {
  try {
    // First check if it's already saved
    const { data: existingData } = await checkIfNoteSaved(userId, noteId);
    
    if (existingData) {
      // Note is already saved, no need to save again
      return { data: existingData, error: null };
    }
    
    // @ts-ignore - Type safety for saved_notes table
    const { data, error } = await supabase
      .from('saved_notes')
      .insert({ user_id: userId, note_id: noteId })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Utility function to unsave a note for a user
export const unsaveNote = async (userId: string, noteId: string) => {
  try {
    // @ts-ignore - Type safety for saved_notes table
    const { error } = await supabase
      .from('saved_notes')
      .delete()
      .eq('user_id', userId)
      .eq('note_id', noteId);
      
    if (error) {
      throw error;
    }
    
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
