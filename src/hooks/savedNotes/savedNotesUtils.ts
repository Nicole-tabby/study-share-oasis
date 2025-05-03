
import { supabase, SavedNote } from '@/integrations/supabase/client';
import { Note } from '../useNotes';

export interface SavedNoteWithData extends SavedNote {
  note?: Note;
}

/**
 * Utility function to fetch saved note references for a user
 */
export async function fetchSavedNoteRefs(userId: string) {
  // @ts-ignore - The saved_notes table is not in the auto-generated types
  const { data: savedNoteRefs, error } = await supabase
    .from('saved_notes')
    .select('*')
    .eq('user_id', userId);
    
  return { savedNoteRefs, error };
}

/**
 * Utility function to fetch notes by their IDs
 */
export async function fetchNotesByIds(noteIds: string[]) {
  const { data: notesData, error } = await supabase
    .from('notes')
    .select('*')
    .in('id', noteIds);
    
  return { notesData, error };
}

/**
 * Utility function to fetch profiles for note authors
 */
export async function fetchProfilesForNotes(notesData: any[]) {
  // Get unique user IDs from notes
  const userIds = [...new Set(notesData.map(note => note.user_id))];
  
  // Fetch all relevant profiles in one query
  const { data: profilesData, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);
    
  return { profilesData, error };
}

/**
 * Check if a note is already saved by a user
 */
export async function checkIfNoteSaved(userId: string, noteId: string) {
  // @ts-ignore
  const { data, error } = await supabase
    .from('saved_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('note_id', noteId)
    .maybeSingle();
    
  return { data, error };
}
