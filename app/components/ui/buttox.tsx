import { Loader2, UploadIcon } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

type Props = {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UploadButton({ handleFileChange }: Props) {
  const { pending } = useFormStatus();

  return (
    <label className=" px-4 py-2 bg-violet-800 text-white rounded cursor-pointer hover:bg-violet-500 flex gap-2 items-center">
      {pending ? (
        <Loader2 className="animate-spin text-white" />
      ) : (
        <UploadIcon className="w-4 h-4" />
      )}
      {pending ? "Uploading..." : "Upload images"}
      <input
        type="file"
        name="file"
        className="hidden"
        multiple
        onChange={(e) => handleFileChange(e)}
        disabled={pending}
      />
    </label>
  );
}
