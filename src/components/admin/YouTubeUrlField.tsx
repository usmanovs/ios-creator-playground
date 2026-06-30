import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getYouTubeId, getYouTubeThumb, isYouTube } from "@/lib/youtube";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
};

export default function YouTubeUrlField({ value, onChange, label = "Video / PDF URL" }: Props) {
  const thumb = isYouTube(value) ? getYouTubeThumb(value) : null;
  const id = isYouTube(value) ? getYouTubeId(value) : null;
  const invalid = isYouTube(value) && !id;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://youtube.com/watch?v=..., direct .mp4, or .pdf"
      />
      {thumb && (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-card/40 border border-border">
          <img src={thumb} alt="thumbnail" className="w-24 h-14 object-cover rounded" />
          <div className="text-xs text-foreground/60">
            <div>YouTube ID: <span className="text-foreground">{id}</span></div>
            <div>Will embed: youtube.com/embed/{id}</div>
          </div>
        </div>
      )}
      {invalid && <p className="text-xs text-destructive">Could not detect a valid YouTube video ID.</p>}
    </div>
  );
}
