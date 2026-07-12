
DROP POLICY IF EXISTS "Admins can upload lesson images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update lesson images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lesson images" ON storage.objects;

CREATE POLICY "Admins can upload lesson images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson-images' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lesson-images' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'lesson-images' AND private.has_role(auth.uid(), 'admin'));
