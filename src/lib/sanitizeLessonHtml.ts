import DOMPurify from "dompurify";

/**
 * Sanitizes lesson HTML and makes images/iframes lazy so lessons with large
 * screenshot sets don't block navigation between lessons.
 */
export function sanitizeLessonHtml(html: string | null | undefined): string {
  if (!html) return "";

  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ["loading", "decoding"] });

  if (typeof window === "undefined" || typeof DOMParser === "undefined") return clean;

  const doc = new DOMParser().parseFromString(clean, "text/html");

  doc.querySelectorAll("img").forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });

  doc.querySelectorAll("iframe").forEach((frame) => {
    frame.setAttribute("loading", "lazy");
  });

  return doc.body.innerHTML;
}
