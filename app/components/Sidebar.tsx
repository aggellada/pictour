"use client";

import React, { useEffect, useRef, useState } from "react";
import PlaceForm from "./PlaceForm";
import { LatLngExpression, Map as LeafletMap } from "leaflet";
import { deleteMarker } from "@/action/action";
import { Marker } from "@/src/app/generated/prisma";
import { Calendar, MapPin, Trash, X } from "lucide-react";
import Alert from "./Alert";
import Form from "./Form";

type LatLng = {
  lat: number;
  lng: number;
};

type Props = {
  handleSidebarMarkerClick: (
    positionCoords: LatLngExpression,
    id: string
  ) => void;
  hideForm: () => void;
  showForm: boolean;
  saveCoords: LatLng | null;
  markersData: Marker[];
  success: boolean;
  ref: React.Ref<HTMLDialogElement>;
  handleClickSubmit: () => void;
};

const Sidebar = ({
  ref,
  success,
  showForm,
  saveCoords,
  markersData,
  hideForm,
  handleSidebarMarkerClick,
  handleClickSubmit,
}: Props) => {
  const [deleteState, setDeleteState] = useState<{
    state: boolean;
    id: string | null;
  }>({
    state: false,
    id: null,
  });

  const dataReversed = [...markersData].reverse();

  return (
    <>
      {success && <Alert ref={ref} />}
      <div className="hidden md:block lg:w-1/5 md:w-2/5 h-full bg-gray-900 border-r-2 border-gray-600 overflow-scroll overflow-x-hidden">
        <div className="w-full grow flex flex-col items-center md:p-2 lg:p-4 gap-4">
          {showForm && (
            <Form
              saveCoords={saveCoords}
              handleClickSubmit={handleClickSubmit}
              hideForm={hideForm}
              display="hidden md:block w-full h-[210px] bg-gray-800 rounded-3xl p-4"
            />
          )}
          {markersData &&
            dataReversed.map((marker) => {
              const coords = { lat: marker.lat, lng: marker.lng };
              const date = new Date(marker.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <div
                  key={marker.place}
                  className="flex justify-between items-start w-full p-4 bg-gray-800 rounded-2xl hover:bg-gray-700 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSidebarMarkerClick(coords, marker.id);
                  }}
                >
                  <div className="flex flex-col gap-2 text-white">
                    <div className="flex items-center gap-2 text-gray-100 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-xs md:text-md">{marker.place}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs md:text-md">{date}</span>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    onClick={async (e) => {
                      e.stopPropagation();
                      setDeleteState({ state: true, id: marker.id });
                      await deleteMarker(marker.id);
                      setDeleteState({ state: false, id: null });
                    }}
                  >
                    {deleteState && deleteState.id === marker.id ? (
                      <span className="text-xs italic">Deleting...</span>
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
