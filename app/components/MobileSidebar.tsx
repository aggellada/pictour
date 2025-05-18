"use client";

import { deleteMarker } from "@/action/action";
import { Image as ImageSchema } from "@/src/app/generated/prisma";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { LatLngExpression } from "leaflet";
import { Calendar, LogOut, MapPin, Search, Trash } from "lucide-react";
import React, { useRef } from "react";

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
  markersData: MarkerSummary[];
  resetExpandBurger: () => void;
  searchLocation: (searchValue: string) => void;
  handleSidebarMarkerClick: (coords: LatLngExpression, id: string) => void;
  deleteStateMobile: (state: boolean, id: string) => void;
  deleteState: {
    state: boolean;
    id: string | null;
  };
};
const MobileSidebar = ({
  markersData,
  resetExpandBurger,
  searchLocation,
  handleSidebarMarkerClick,
  deleteStateMobile,
  deleteState,
}: Props) => {
  const { isAuthenticated, getUser } = useKindeBrowserClient();

  const user = getUser();
  const searchRef = useRef<HTMLInputElement | null>(null);

  const dataReversed = [...markersData].reverse();

  return (
    <div className="md:hidden flex w-full min-h-screen flex-col gap-2 bg-gray-900 absolute top-[82px] right-0 z-[9999] px-2">
      <div className="flex justify-between w-full h-[80px] items-center mt-2">
        <div className="flex gap-4 items-center justify-center ">
          {user && user?.picture && (
            <img
              src={user.picture}
              className="rounded-full w-[50px] object-cover"
            />
          )}
          {user && <h1>Hi, {user.given_name}!</h1>}
        </div>
        <div className="">
          {isAuthenticated && (
            <div className="">
              <LogoutLink>
                <LogOut />
              </LogoutLink>
            </div>
          )}
        </div>
      </div>
      <div className="py-2">
        <div className="flex gap-4">
          <input
            type="text"
            className="bg-white text-black w-11/12 rounded-sm"
            ref={searchRef}
            placeholder="Search the map"
          />
          <button
            onClick={() => {
              resetExpandBurger();
              searchLocation(searchRef.current?.value || "");
            }}
          >
            <Search />
          </button>
        </div>
      </div>
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
              className="flex justify-between items-start w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-md transition cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSidebarMarkerClick(coords, marker.id);
                resetExpandBurger();
              }}
            >
              <div className="flex flex-col gap-2 text-white">
                <div className="flex items-center gap-2 text-gray-100 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{marker.place}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{date}</span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 transition"
                onClick={async (e) => {
                  e.stopPropagation();
                  deleteStateMobile(true, marker.id);
                  await deleteMarker(marker.id);
                  deleteStateMobile(true, marker.id);
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
  );
};

export default MobileSidebar;
