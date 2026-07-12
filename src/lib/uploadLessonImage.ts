import { supabase } from "@/integrations/supabase/client";

export async function uploadLessonImage(file: File | Blob): Promise<string> {
  const type = file.type || "image/png";
  const ext = type.split("/")[1]?.split("+")[0] || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("lesson-images")
    .upload(path, file, { contentType: type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("lesson-images").getPublicUrl(path);
  return data.publicUrl;
}
