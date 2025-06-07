"use client"
import { ModalContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  imageSrc: string;
  setUploading?: Dispatch<SetStateAction<boolean>>;
  setAvatar: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  circularCrop?: boolean;
  aspect?: number;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropper: React.FC<Props> = ({
  imageSrc,
  setUploading,
  setAvatar,
  circularCrop = false,
  aspect = 1,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { hideModal } = useMeaningfulContext(ModalContext);

  const onImageLoaded = (width: number, height: number) => {
    setCrop(centerAspectCrop(width, height, aspect));
  };

  function getCroppedImageCanvas(image: HTMLImageElement, crop: PixelCrop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx || !crop.width || !crop.height) return null;

    canvas.width = crop.width;
    canvas.height = crop.height;

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

    return canvas;
  }

  const handleCrop = () => {
    if (crop && imgRef.current) {
      if (setUploading) setUploading(true);
      const canvas = getCroppedImageCanvas(
        imgRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );

      canvas?.toBlob(async (blob) => {
        if (!blob) return;

        try {
          setAvatar(blob);
        } catch (error) {
          console.log(error);
        } finally {
          hideModal();
        }
      }, "image/png");
      if (setUploading) setUploading(false);
    }
  };

  return (
    <>
      {imageSrc && (
        <div className="flex flex-col items-center crop-box p-4">
          <ReactCrop
            crop={crop}
            circularCrop={circularCrop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={aspect}
            minHeight={100}
          >
            <Image
              ref={imgRef}
              src={imageSrc}
              alt="Upload"
              onLoadingComplete={(img) =>
                onImageLoaded(img.naturalWidth, img.naturalHeight)
              }
              width={500} // Provide appropriate width
              height={500} // Provide appropriate height
            />
          </ReactCrop>
        </div>
      )}

      <div className="flex gap-3 justify-end sticky bottom-1">
        <button
          onClick={handleCrop}
          className="text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Crop Image
        </button>
      </div>
    </>
  );
};

export default ImageCropper;
