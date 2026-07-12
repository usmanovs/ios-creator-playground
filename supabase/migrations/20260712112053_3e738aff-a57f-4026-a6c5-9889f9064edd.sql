
CREATE POLICY "Authenticated users can view lesson images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'lesson-images');

CREATE POLICY "Admins can upload lesson images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lesson-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'lesson-images' AND public.has_role(auth.uid(), 'admin'));
