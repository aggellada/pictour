"use client";

import { uploadImages } from "@/action/action";
import React, { useRef } from "react";
import UploadButton from "./ui/buttox";

type Props = {
  id: string;
};

export default function ImagesForm({ id }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length > 0 && formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <form
      action={(formData) => uploadImages(formData, id)}
      ref={formRef}
      className="flex justify-center w-full"
    >
      <UploadButton handleFileChange={handleFileChange} />
    </form>
  );
}
