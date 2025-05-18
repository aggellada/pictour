"use client";

import { Image as ImageSchema } from "@/src/app/generated/prisma";
import React, { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "./Modal";

type MarkerSummary = {
  id: string;
  place: string;
  date: Date;
  lat: number;
  lng: number;
  userId: string;
  images: ImageSchema[];
  slug: string;
};

type Props = {
  location: MarkerSummary;
  locationSlug: string;
};

export default function ImageMasonry({ location, locationSlug }: Props) {
  const [imageClickIndex, setImageClickIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const modalRef = useRef<HTMLDialogElement>(null);
  console.log(showModal, imageClickIndex);

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current?.showModal();
      document.body.classList.add("overflow-hidden");
    } else {
      modalRef.current?.close();
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showModal]);

  const imageCardClick = (index: number) => {
    setImageClickIndex(index);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <Modal
          ref={modalRef}
          locationImages={location.images}
          imageClickIndex={imageClickIndex}
          closeModal={closeModal}
        />
      )}

      <div className="columns-[300px] lg:columns-3">
        {location &&
          location?.images.map((image, index) => (
            <ImageCard
              key={image.id}
              index={index}
              imageData={image}
              locationSlug={locationSlug}
              imageCardClick={imageCardClick}
              openModal={openModal}
            />
          ))}
      </div>
    </>
  );
}
