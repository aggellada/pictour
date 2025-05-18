import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import ImagesForm from "./ImagesForm";
import { LatLngExpression } from "leaflet";
import { Image as ImageSchema } from "@/src/app/generated/prisma";
import { MapPinIcon } from "lucide-react";

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
  marker: MarkerSummary;
  handleMarkerClick: (coords: LatLngExpression) => void;
  markerRefs: React.RefObject<{ [key: string]: L.Marker | null }>;
};

function MarkerPopup({ marker, handleMarkerClick, markerRefs }: Props) {
  const positionCoords = { lat: marker.lat, lng: marker.lng };
  const slicedImagesArr = marker.images.slice(0, 4);
  const totalMinusSliced = marker.images.length - slicedImagesArr.length;

  const date = new Date(marker.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Marker
      position={positionCoords}
      eventHandlers={{
        click: () => handleMarkerClick(positionCoords),
      }}
      ref={(ref) => {
        markerRefs.current[marker.id] = ref;
      }}
    >
      <Popup>
        <h1 className="text-lg font-semibold text-gray-800 text-center">
          {marker.place}
        </h1>
        <h1 className="text-md font-extralight text-gray-800 text-center mb-2">
          {date}
        </h1>
        {marker.images.length === 0 && (
          <h1 className="text-center">No images have been uploaded.</h1>
        )}
        <div className="w-full grid grid-cols-2 gap-2">
          {marker.images.length > 4
            ? slicedImagesArr.map((image) => {
                return (
                  <Image
                    src={image.link}
                    key={image.id}
                    className="w-full h-28 object-cover rounded-md"
                    width={300}
                    height={300}
                    alt={image.link}
                    loading="lazy"
                  />
                );
              })
            : marker.images.map((image) => (
                <Image
                  src={image.link}
                  key={image.id}
                  className="w-full h-28 object-cover rounded-md"
                  width={300}
                  height={300}
                  alt={image.link}
                  loading="lazy"
                />
              ))}
        </div>
        <div className="w-full flex justify-between my-2">
          <h1 className="text-gray-500 text-sm">
            {marker.images.length > 4 && `+ ${totalMinusSliced} more images`}
          </h1>
          {marker.images.length > 0 && (
            <Link href={`location/${marker.slug}`}>View all images</Link>
          )}
        </div>
        <ImagesForm id={marker.id} />
      </Popup>
    </Marker>
  );
}

export default MarkerPopup;
