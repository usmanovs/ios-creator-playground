import { supabase } from "@/integrations/supabase/client";

// ~100 years — effectively permanent for embedded lesson images
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365 * 100;

export async function uploadLessonImage(file: File | Blob): Promise<string> {
  const type = file.type || "image/png";
  const ext = (type.split("/")[1] || "png").split("+")[0];
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("lesson-images")
    .upload(path, file, { contentType: type, upsert: false });
  if (upErr) throw upErr;

  const { data, error } = await supabase.storage
    .from("lesson-images")
    .createSignedUrl(path, SIGNED_URL_EXPIRY);
  if (error || !data) throw error ?? new Error("Failed to sign URL");

  return data.signedUrl;
}
