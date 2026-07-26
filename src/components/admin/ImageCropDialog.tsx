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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleClose = () => {
    setPreviewUrl(null);
    setCrop(undefined);
    setCompleted(null);
    onClose();
  };

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
      setPreviewUrl(url);
      toast.success("Image cropped and updated");
    } catch (e: any) {
      toast.error(e?.message ?? "Crop failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!src} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{previewUrl ? "Cropped image preview" : "Crop image"}</DialogTitle>
        </DialogHeader>

        {previewUrl ? (
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center gap-3 p-2">
            <div className="w-full rounded-md border border-green-500/40 bg-green-500/10 text-green-200 text-sm px-3 py-2">
              ✓ Image cropped successfully and updated in the lesson.
            </div>
            <div className="bg-black/20 rounded-lg p-2 flex items-center justify-center w-full">
              <img
                src={previewUrl}
                alt="cropped preview"
                style={{ maxHeight: "60vh" }}
                className="rounded"
              />
            </div>
          </div>
        ) : (
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
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const w = img.width;
                    const h = img.height;
                    const size = Math.min(w, h) * 0.8;
                    const initial: PixelCrop = {
                      unit: "px",
                      x: (w - size) / 2,
                      y: (h - size) / 2,
                      width: size,
                      height: size,
                    };
                    setCrop(initial);
                    setCompleted(initial);
                  }}
                />
              </ReactCrop>
            )}
          </div>
        )}

        <DialogFooter>
          {previewUrl ? (
            <>
              <Button variant="outline" onClick={() => setPreviewUrl(null)} disabled={busy}>
                Crop again
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={apply} disabled={busy}>
                {busy ? "Cropping…" : "Apply crop"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
