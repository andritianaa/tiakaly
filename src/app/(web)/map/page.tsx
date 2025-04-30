"use client";
import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/(web)/map/Map"), {
  ssr: false,
});

export default function RoutePage() {
  return (
    <>
      <div className="h-screen w-full map-page">
        <Map />
      </div>
    </>
  );
}
