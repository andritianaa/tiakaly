import L from "leaflet";

export const MARKER = new L.Icon({
  iconUrl: "/marker-icon-red.png",
  className: "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive",
  iconRetinaUrl: "/icon_leaflet/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconAnchor: [12 * 1.3, 32 * 1.3],
  popupAnchor: [0, -32 * 1.3],
  shadowRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41 * 1.3, 41 * 1.3],
  shadowAnchor: [14 * 1.3, 41 * 1.3],
});
