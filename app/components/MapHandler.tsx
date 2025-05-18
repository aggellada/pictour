"use client";

import { LatLngExpression } from "leaflet";
import { useMapEvents } from "react-leaflet";

type LatLng = {
  lat: number;
  lng: number;
};

type Props = {
  handleMapClick: (coords: LatLngExpression) => void;
  handleMapSaveCoords: (coords: LatLng) => void;
};

function MapHandler({ handleMapClick, handleMapSaveCoords }: Props) {
  useMapEvents({
    click(e) {
      handleMapClick(e.latlng);
      handleMapSaveCoords(e.latlng);
    },
  });

  return null;
}

export default MapHandler;
