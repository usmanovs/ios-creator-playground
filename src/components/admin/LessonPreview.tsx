import { useMemo } from "react";
import DOMPurify from "dompurify";
import { isYouTube, toYouTubeEmbed } from "@/lib/youtube";

type Props = {
  lessonType: string;
  videoUrl: string | null;
  contentHtml: string | null;
  title: string;
};

export default function LessonPreview({ lessonType, videoUrl, contentHtml, title }: Props) {
  const safeHtml = useMemo(
    () => (contentHtml ? DOMPurify.sanitize(contentHtml) : ""),
    [contentHtml]
  );

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 h-full overflow-y-auto">
      <div className="text-xs uppercase tracking-wide text-foreground/50">Preview</div>
      <h3 className="font-display text-lg font-bold">{title || "Untitled"}</h3>
      {lessonType === "video" && videoUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          {isYouTube(videoUrl) ? (
            <iframe src={toYouTubeEmbed(videoUrl)} title={title} className="w-full h-full" allowFullScreen />
          ) : (
            <video src={videoUrl} controls className="w-full h-full" />
          )}
        </div>
      )}
      {lessonType === "pdf" && videoUrl && (
        <iframe src={videoUrl} title={title} className="w-full h-[50vh] rounded-lg bg-white" />
      )}
      {lessonType === "text" && (
        <article
          className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: safeHtml || "<p class='text-foreground/40'>No content yet.</p>" }}
        />
      )}
      {(lessonType === "video" || lessonType === "pdf") && !videoUrl && (
        <p className="text-foreground/40 text-sm">No URL provided.</p>
      )}
    </div>
  );
}
