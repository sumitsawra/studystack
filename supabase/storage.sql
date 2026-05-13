-- ========================================
-- Storage Bucket Setup
-- ========================================

-- Create papers bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'papers',
  'papers',
  true,
  52428800, -- 50MB
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ---- Storage Policies ----

-- Papers: public read
CREATE POLICY "Public read for papers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'papers');

-- Papers: authenticated upload
CREATE POLICY "Authenticated users can upload papers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'papers' AND auth.role() = 'authenticated');

-- Papers: owners can delete
CREATE POLICY "Users can delete their own papers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'papers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Avatars: public read
CREATE POLICY "Public read for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Avatars: authenticated upload
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Avatars: owners can update/delete
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
