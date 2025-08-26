import { Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { Marker as MyMarker } from "@/types";

type LocationMarkersProps = {
  markers: MyMarker[];
};

export default function LocationMarkers({ markers }: LocationMarkersProps) {
  const markerHtml = (color: string) => `
    <svg
      width="28"
      height="41"
      viewBox="0 0 28 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 41 14 41S28 24.5 28 14C28 6.268 21.732 0 14 0Z"
        fill="${color}"
        stroke="white"
        stroke-width="2"
      />
      <circle cx="14" cy="14" r="6" fill="white" />
    </svg>`;

  const markerIcon = (color: string) =>
    L.divIcon({
      html: markerHtml(color),
      className: "",
      iconSize: [25, 41],
      iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // Point from which the popup should open
    });

  return (
    <>
      {markers.map(
        (marker, index) =>
          marker && (
            <Marker
              key={marker.id || index}
              position={[marker.lat, marker.lng]}
              icon={markerIcon(marker.color)}
            >
              <Popup>{marker.popupContent}</Popup>
            </Marker>
          )
      )}
    </>
  );
}
