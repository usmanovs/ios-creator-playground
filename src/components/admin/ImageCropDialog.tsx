import { useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadLessonImage } from "@/lib/uploadLessonImage";

type Props = {
  src: string | null;
  onClose: () => void;
  onCropped: (newUrl: string) => void;
};

export default function ImageCropDialog({ src, onClose, onCropped }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completed, setCompleted] = useState<PixelCrop | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = async () => {
    if (!imgRef.current || !completed || !completed.width || !completed.height) {
      toast.error("Select a crop area");
      return;
    }
    setBusy(true);
    try {
      const img = imgRef.current;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(completed.width * scaleX);
      canvas.height = Math.round(completed.height * scaleY);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      ctx.drawImage(
        img,
        completed.x * scaleX,
        completed.y * scaleY,
        completed.width * scaleX,
        completed.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Crop failed"))), "image/png")
      );
      const url = await uploadLessonImage(blob);
      onCropped(url);
      toast.success("Image cropped");
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Crop failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!src} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1 flex items-center justify-center bg-black/20 rounded-lg p-2">
          {src && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompleted(c)}
            >
              <img
                ref={imgRef}
                src={src}
                crossOrigin="anonymous"
                alt="to crop"
                style={{ maxHeight: "70vh" }}
              />
            </ReactCrop>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={apply} disabled={busy}>
            {busy ? "Cropping…" : "Apply crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
