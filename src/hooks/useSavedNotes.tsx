
import { useGetSavedNotes } from './savedNotes/useGetSavedNotes';
import { useSaveNote } from './savedNotes/useSaveNote';
import { useUnsaveNote } from './savedNotes/useUnsaveNote';
import { useIsNoteSaved } from './savedNotes/useIsNoteSaved';
import { type SavedNoteWithData } from './savedNotes/savedNotesUtils';

// Export the type using the 'export type' syntax for isolatedModules compatibility
export type { SavedNoteWithData };

export const useSavedNotes = () => {
  return {
    useGetSavedNotes,
    useSaveNote,
    useUnsaveNote,
    useIsNoteSaved
  };
};
