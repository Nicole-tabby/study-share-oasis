
-- 1. Add length constraints on notes table
ALTER TABLE public.notes
  ADD CONSTRAINT notes_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT notes_course_length CHECK (char_length(course) <= 100),
  ADD CONSTRAINT notes_semester_length CHECK (char_length(semester) <= 50),
  ADD CONSTRAINT notes_description_length CHECK (char_length(description) <= 2000);

-- 2. Add length constraints on profiles table
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_full_name_length CHECK (char_length(full_name) <= 100),
  ADD CONSTRAINT profiles_bio_length CHECK (char_length(bio) <= 500),
  ADD CONSTRAINT profiles_university_length CHECK (char_length(university) <= 200),
  ADD CONSTRAINT profiles_course_length CHECK (char_length(course) <= 100),
  ADD CONSTRAINT profiles_year_length CHECK (char_length(year) <= 20);

-- 3. Fix profile visibility: drop public-to-everyone policy, add authenticated-only policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);
