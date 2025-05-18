import React from "react";

type Props = {
  ref: React.Ref<HTMLDialogElement>;
};

export default function Alert({ ref }: Props) {
  return (
    <dialog
      ref={ref}
      className="m-auto flex flex-col gap-6 p-6 justify-center border-none rounded-2xl"
    >
      <h1 className="font-medium text-md ">
        You have successfully placed a marker!
      </h1>
      <button className="py-2 px-6 text-gray-100 bg-red-600 font-semibold text-md border-none rounded-2xl self-center w-auto">
        Close
      </button>
    </dialog>
  );
}
