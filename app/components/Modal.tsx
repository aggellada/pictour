"use client";

import { Image as imageSchema, Marker } from "@/src/app/generated/prisma";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  ref: React.Ref<HTMLDialogElement>;
  locationImages: imageSchema[];
  imageClickIndex: number;
  closeModal: () => void;
};

export default function Modal({
  ref,
  locationImages,
  imageClickIndex,
  closeModal,
}: Props) {
  const [imageIndexState, setimageIndexState] =
    useState<number>(imageClickIndex);

  const specImage = locationImages[imageIndexState].link;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setimageIndexState((prev) => {
          if (prev === 0) return prev;
          return prev - 1;
        });
      } else if (e.key === "ArrowRight") {
        setimageIndexState((prev) => {
          if (prev === locationImages.length - 1) return prev;
          return prev + 1;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const subtractIndex = () => {
    setimageIndexState((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  };

  const addIndex = () => {
    setimageIndexState((prev) => {
      if (prev === locationImages.length - 1) return prev;
      return prev + 1;
    });
  };

  return (
    <dialog
      ref={ref}
      className="max-h-screen w-screen overflow-auto m-auto bg-transparent border-none "
      onClose={closeModal}
    >
      <div className="w-full flex justify-end text-white pr-8">
        <X
          onClick={() => {
            closeModal();
          }}
          className=" hover:text-red-500 transition"
        />
      </div>
      <div className="flex h-full items-center justify-center text-white gap-12">
        <button onClick={subtractIndex} className="">
          {imageIndexState === 0 ? (
            ""
          ) : (
            <ChevronLeft className="hover:cursor-pointer" />
          )}
        </button>
        <img src={specImage} className="w-auto h-auto max-h-[90vh] " />
        <button onClick={addIndex}>
          {imageIndexState === locationImages.length - 1 ? (
            ""
          ) : (
            <ChevronRight className="hover:cursor-pointer" />
          )}
        </button>
      </div>
    </dialog>
  );
}
