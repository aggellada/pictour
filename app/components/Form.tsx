import { X } from "lucide-react";
import React from "react";
import PlaceForm from "./PlaceForm";

type LatLng = {
  lat: number;
  lng: number;
};

type Props = {
  hideForm: () => void;
  handleClickSubmit: () => void;
  saveCoords: LatLng | null;
  display: string;
};

export default function Form({
  hideForm,
  handleClickSubmit,
  saveCoords,
  display,
}: Props) {
  return (
    <div className={display}>
      <div className="w-full flex justify-end">
        <button className="" onClick={hideForm}>
          <X />
        </button>
      </div>
      <PlaceForm
        saveCoords={saveCoords}
        handleClickSubmit={handleClickSubmit}
      />
    </div>
  );
}
