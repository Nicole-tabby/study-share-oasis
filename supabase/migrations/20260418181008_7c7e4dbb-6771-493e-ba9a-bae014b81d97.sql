
-- 1) Make 'notes' bucket private
UPDATE storage.buckets SET public = false WHERE id = 'notes';

-- 2) Drop the unsafe avatar update policy (folder-scoped one remains)
DROP POLICY IF EXISTS "Users can update their avatars" ON storage.objects;

-- 3) Drop broad / duplicate SELECT policies that enable listing
DROP POLICY IF EXISTS "Anyone can read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read notes" ON storage.objects;
DROP POLICY IF EXISTS "Public can view notes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view note files" ON storage.objects;

-- 4) Drop overly broad notes upload policy (folder-scoped one remains)
DROP POLICY IF EXISTS "Authenticated users can upload notes" ON storage.objects;

-- 5) Avatars: allow read by exact name only (prevents listing). Public can still fetch a known avatar URL.
CREATE POLICY "Avatars readable by path"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars' AND name IS NOT NULL);

-- 6) Notes: owners can read their own files
CREATE POLICY "Users can read own notes files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'notes'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 7) Notes: anyone can read files belonging to public notes (signed URL flow)
CREATE POLICY "Public notes files readable"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (
  bucket_id = 'notes'
  AND EXISTS (
    SELECT 1 FROM public.notes n
    WHERE n.public = true
      AND n.file_url = storage.objects.name
  )
);
