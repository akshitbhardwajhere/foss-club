"use client";
import {
  type ChangeEvent,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getCroppedImg } from "@/lib/cropImage";
import ExistingImagePreview from "@/components/image-upload/ExistingImagePreview";
import UploadDropzone from "@/components/image-upload/UploadDropzone";
import CropEditor from "@/components/image-upload/CropEditor";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
}

/**
 * ImageUpload Component
 *
 * Provides an interactive UI for users to upload, preview, and natively crop images
 * explicitly locked to a 1:1 aspect ratio when using corner handles.
 * Uploads the processed blob directly to Cloudinary.
 *
 * @param {ImageUploadProps} props - Component properties capturing the resulting URL.
 */
export default function ImageUpload({ onChange, value }: ImageUploadProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [dynamicAspect, setDynamicAspect] = useState<number | undefined>(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const onSelectFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      setCompletedCrop(null);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setPreviewUrl(reader.result?.toString() || ""); // Set preview URL for next/image
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const onImageLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 70, // Create a 70% width crop by default
        },
        1, // Aspect ratio 1:1 initially
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(crop);
  }, []);

  // Determine if user is dragging a corner or a side handle
  const handleDragStart = (e: PointerEvent<HTMLDivElement> | Event) => {
    const target = e.target as HTMLElement;
    // ReactCrop appends classes like "ReactCrop__drag-handle ord-nw"
    if (target.className && typeof target.className === "string") {
      const isCorner =
        target.className.includes("ord-nw") ||
        target.className.includes("ord-ne") ||
        target.className.includes("ord-sw") ||
        target.className.includes("ord-se");

      const isSide =
        target.className.includes("ord-n ") ||
        target.className.includes("ord-s ") ||
        target.className.includes("ord-e ") ||
        target.className.includes("ord-w ") ||
        target.className.endsWith("ord-n") ||
        target.className.endsWith("ord-s") ||
        target.className.endsWith("ord-e") ||
        target.className.endsWith("ord-w");

      if (isCorner) {
        setDynamicAspect(1);
      } else if (isSide) {
        setDynamicAspect(undefined);
      } else {
        // Clicking inside the mask to move it
        setDynamicAspect(undefined);
      }
    }
  };

  const uploadToCloudinary = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsUploading(true);
    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);

      const formData = new FormData();
      formData.append("file", blob);

      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!preset || !cloudName) {
        toast.error(
          "Missing Cloudinary configuration variables in environment.",
        );
        return;
      }

      formData.append("upload_preset", preset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Upload failed");
      }

      const data = await res.json();
      onChange(data.secure_url);
      setImgSrc("");
      setPreviewUrl("");
      toast.success("Image cropped and uploaded successfully.");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload the image to Cloudinary.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    setIsRemoving(true);
    try {
      // Target our new backend explicit drop route
      await api.delete("/api/upload/remove", {
        data: { imageUrl: value },
      });
      onChange("");
      toast.success("Image removed successfully.");
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
      toast.error("Failed to remove the image.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Show existing image if it exists and we're not currently cropping a new one */}
      {value && !imgSrc ? (
        <ExistingImagePreview
          value={value}
          isRemoving={isRemoving}
          onRemove={handleRemove}
        />
      ) : null}

      {/* 2. Upload / Drop Area when not cropping */}
      {!imgSrc && (
        <UploadDropzone
          hasValue={Boolean(value)}
          onOpenPicker={() => fileInputRef.current?.click()}
          onSelectFile={onSelectFile}
          fileInputRef={fileInputRef}
        />
      )}

      {/* 3. Crop Area when picking a file */}
      {imgSrc && (
        <CropEditor
          imgSrc={imgSrc}
          previewUrl={previewUrl}
          crop={crop}
          dynamicAspect={dynamicAspect}
          completedCrop={completedCrop}
          isUploading={isUploading}
          imgRef={imgRef}
          onCropChange={setCrop}
          onCropComplete={setCompletedCrop}
          onDragStart={handleDragStart}
          onImageLoad={onImageLoad}
          onCancel={() => {
            setImgSrc("");
            setCrop(undefined);
            setPreviewUrl("");
          }}
          onUpload={uploadToCloudinary}
        />
      )}
    </div>
  );
}
