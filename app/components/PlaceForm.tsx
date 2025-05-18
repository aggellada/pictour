"use client";

import { saveForm } from "@/action/action";
import { SendHorizontal } from "lucide-react";

type LatLng = {
  lat: number;
  lng: number;
};

type Props = {
  saveCoords: LatLng | null;
  handleClickSubmit: () => void;
};

export default function PlaceForm({ saveCoords, handleClickSubmit }: Props) {
  return (
    <>
      <form
        action={saveForm}
        onSubmit={handleClickSubmit}
        className="flex flex-col px-4 gap-1"
      >
        <label>Place</label>
        <input
          type="text"
          className="bg-white text-black"
          name="place"
          required
        />
        <label>Date</label>
        <input
          type="date"
          className="bg-white mb-3 text-black"
          name="date"
          required
        />
        {saveCoords && (
          <>
            <input type="hidden" name="lat" value={saveCoords?.lat} />
            <input type="hidden" name="lng" value={saveCoords?.lng} />
          </>
        )}
        <div className="flex w-full justify-end">
          <button type="submit" className=" bg-gray-700 rounded-full p-2">
            <SendHorizontal />
          </button>
        </div>
      </form>
    </>
  );
}
