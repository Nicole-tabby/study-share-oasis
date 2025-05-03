
import { useGetSavedNotes } from './savedNotes/useGetSavedNotes';
import { useSaveNote } from './savedNotes/useSaveNote';
import { useUnsaveNote } from './savedNotes/useUnsaveNote';
import { useIsNoteSaved } from './savedNotes/useIsNoteSaved';
import { SavedNoteWithData } from './savedNotes/savedNotesUtils';

export { SavedNoteWithData };

export const useSavedNotes = () => {
  return {
    useGetSavedNotes,
    useSaveNote,
    useUnsaveNote,
    useIsNoteSaved
  };
};
