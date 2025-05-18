"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Image as imageSchema } from "@/src/app/generated/prisma";
import { fetchSearchCoordinates } from "@/action/action";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import MapHandler from "./MapHandler";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";
import MarkerPopup from "./MarkerPopup";
import Form from "./Form";

// LatLng and LatLngExpression
// input validation
// error handling
// form validation

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type MarkerSummary = {
  id: string;
  place: string;
  date: Date;
  lat: number;
  lng: number;
  userId: string;
  images: imageSchema[];
  slug: string;
};

type Props = {
  markersData: MarkerSummary[];
};

type LatLng = {
  lat: number;
  lng: number;
};

export default function Map({ markersData }: Props) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [initialMarker, setInitialMarker] = useState<LatLngExpression | null>(
    null
  );
  const [saveCoords, setSaveCoords] = useState<LatLng | null>(null);
  const [expandBurger, setExpandBurger] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [deleteState, setDeleteState] = useState<{
    state: boolean;
    id: string | null;
  }>({
    state: false,
    id: null,
  });

  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<{ [id: string]: L.Marker | null }>({});
  const alertRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (success) {
      alertRef.current?.showModal();
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    } else {
      alertRef.current?.close();
    }
  }, [success]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const handleMapSaveCoords = (coords: LatLng): void => {
    setSaveCoords(coords);
  };

  const hideForm = (): void => {
    setShowForm(false);
    setInitialMarker(null);
  };

  const handleExpandBurger = () => {
    setExpandBurger((prev) => !prev);
  };

  const resetExpandBurger = () => {
    setExpandBurger(false);
  };

  const handleClickSubmit = () => {
    setSuccess(true);
    hideForm();
  };

  const handleMapClick = (coords: LatLngExpression): void => {
    const map = mapRef.current;
    setShowForm(true);

    if (showForm === false) {
      map?.flyTo(coords, 13);
      setInitialMarker(coords);
    }
  };

  const handleMarkerClick = (coords: LatLngExpression): void => {
    const map = mapRef.current;
    map?.flyTo(coords, 13);
  };

  const handleSidebarMarkerClick = (
    coords: LatLngExpression,
    id: string
  ): void => {
    const map = mapRef.current;
    map?.flyTo(coords, 13);

    const marker = markerRefs.current[id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 500);
    }
  };

  const searchLocation = async (searchValue: string): Promise<void> => {
    const map = mapRef.current;
    const data = await fetchSearchCoordinates(searchValue);

    if (data) {
      map?.flyTo([data[0].latitude, data[0].longitude], 13);
    }
  };

  const deleteStateMobile = (state: boolean, id: string) => {
    setDeleteState({ state, id });
  };

  if (!position) return <h1 className="">Loading map...</h1>;

  return (
    <div className="w-full h-screen flex flex-col relative">
      {showForm && (
        <Form
          saveCoords={saveCoords}
          handleClickSubmit={handleClickSubmit}
          hideForm={hideForm}
          display="md:hidden w-full h-[210px] bottom-0 absolute z-[9999] bg-gray-800 p-4"
        />
      )}
      <Header
        searchLocation={searchLocation}
        handleExpandBurger={handleExpandBurger}
      />
      <div className="w-full grow h-full flex relative overflow-hidden">
        <Sidebar
          success={success}
          ref={alertRef}
          showForm={showForm}
          saveCoords={saveCoords}
          hideForm={hideForm}
          markersData={markersData}
          handleSidebarMarkerClick={handleSidebarMarkerClick}
          handleClickSubmit={handleClickSubmit}
        />
        <div className="flex w-full h-full">
          <MapContainer
            ref={mapRef}
            center={position}
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapHandler
              handleMapClick={handleMapClick}
              handleMapSaveCoords={handleMapSaveCoords}
            />
            <Marker position={position}>
              <Popup>
                <h1 className="text-center">You are here.</h1>
              </Popup>
            </Marker>
            {initialMarker && (
              <Marker position={initialMarker}>
                <Popup>This is a marker click.</Popup>
              </Marker>
            )}
            {markersData.map((marker) => {
              return (
                <MarkerPopup
                  key={marker.id}
                  marker={marker}
                  handleMarkerClick={handleMarkerClick}
                  markerRefs={markerRefs}
                />
              );
            })}
          </MapContainer>
        </div>
      </div>

      {expandBurger && (
        <MobileSidebar
          markersData={markersData}
          resetExpandBurger={resetExpandBurger}
          deleteStateMobile={deleteStateMobile}
          searchLocation={searchLocation}
          handleSidebarMarkerClick={handleSidebarMarkerClick}
          deleteState={deleteState}
        />
      )}
    </div>
  );
}
