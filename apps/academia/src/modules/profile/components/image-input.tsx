"use client";

import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crop as CropIcon, Upload } from "lucide-react";

// Utility: crop image into a canvas and return base64 blob
async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not found");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas.toDataURL("image/jpeg", 0.8); // Added quality parameter
}

// Default crop configuration
const DEFAULT_CROP: Crop = {
  unit: "%",
  width: 80,
  height: 80,
  x: 10,
  y: 10,
};

interface Props {
  value?: string; // current photo URL
  onChange: (url: string) => void; // callback after save
  name?: string; // fallback initials
  disabled?: boolean; // disable the input
}

export default function ProfileImageInput({
  value,
  onChange,
  name,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [upImg, setUpImg] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>(DEFAULT_CROP);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUpImg(reader.result?.toString() || null);
        setCrop(DEFAULT_CROP); // Reset to default crop
        setCompletedCrop(null);
        setOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = (img: HTMLImageElement) => {
    imgRef.current = img;

    const { width, height } = img;
    const defaultPixelCrop: PixelCrop = {
      unit: "px",
      width: Math.min(width, height) * 0.8,
      height: Math.min(width, height) * 0.8,
      x: (width - Math.min(width, height) * 0.8) / 2,
      y: (height - Math.min(width, height) * 0.8) / 2,
    };
    setCompletedCrop(defaultPixelCrop);

    return false;
  };

  const handleSave = async () => {
    if (imgRef.current && completedCrop) {
      const cropped = await getCroppedImg(imgRef.current, completedCrop);
      onChange(cropped);
      setOpen(false);
    }
  };

  const handleCropExisting = () => {
    if (disabled) return;

    if (value) {
      setUpImg(value);
      setCrop(DEFAULT_CROP);
      setCompletedCrop(null);
      setOpen(true);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setUpImg(null);
    setCrop(DEFAULT_CROP);
    setCompletedCrop(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="w-24 h-24">
          <AvatarImage src={value} />
          <AvatarFallback>
            {name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "م"}
          </AvatarFallback>
        </Avatar>

        {/* زر قص الصورة إذا موجودة */}
        {value && !disabled && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCropExisting}
          >
            <CropIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!disabled && (
        <div className="flex gap-2">
          {/* رفع صورة */}
          <Button variant="outline" className="relative">
            <Upload className="w-4 h-4 mr-2" />
            {value ? "تغيير الصورة" : "رفع صورة"}
            <Input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </Button>

          {/* قص صورة موجودة */}
          {value && (
            <Button variant="outline" onClick={handleCropExisting}>
              <CropIcon className="w-4 h-4 mr-2" />
              قص الصورة
            </Button>
          )}
        </div>
      )}

      {/* نافذة القص */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>قص صورتك</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center">
            {upImg && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  alt="قص الصورة"
                  src={upImg}
                  style={{ maxHeight: "400px", maxWidth: "100%" }}
                  onLoad={(e) => onImageLoaded(e.currentTarget)}
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={!completedCrop}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
