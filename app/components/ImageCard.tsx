"use client";

import { deleteImage } from "@/action/action";
import Image from "next/image";

type imageSummary = {
  id: string;
  markerId: string;
  link: string;
  publicId: string;
};

type Props = {
  imageData: imageSummary;
  locationSlug: string;
  index: number;
  openModal: () => void;
  imageCardClick: (index: number) => void;
};

export default function ImageCard({
  imageData,
  locationSlug,
  openModal,
  imageCardClick,
  index,
}: Props) {
  return (
    <div
      className="relative w-full "
      onClick={() => {
        openModal();
        imageCardClick(index);
      }}
    >
      
      <Image
        src={imageData.link}
        key={imageData.id}
        width={500}
        height={500}
        loading="lazy"
        className="w-full mb-4"
        alt="image-card"
      />
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteImage(imageData.id, locationSlug, imageData.publicId);
          }}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded shadow"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
