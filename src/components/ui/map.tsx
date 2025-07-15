import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Markers } from "@/types";
import * as L from "leaflet";
import { useEffect } from "react";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { geocoder, geocoders } from "leaflet-control-geocoder";
import "./map.css";
import { LocateControl } from "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

type MapProps = {
  markers: Markers;
  onMapClick: (lat: number, lng: number) => void;
};

type LocationMarkersProps = {
  markers: Markers;
};

type OnMapClickProps = {
  onMapClick: (lat: number, lng: number) => void;
};

function LocationMarkers({ markers }: LocationMarkersProps) {
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
      {Object.values(markers).map(
        (marker, index) =>
          marker && (
            <Marker
              key={index}
              position={[marker.latlng.lat, marker.latlng.lng]}
              icon={markerIcon(marker.color)}
            >
              <Popup>{marker.popupContent}</Popup>
            </Marker>
          )
      )}
    </>
  );
}

function OnMapClick({ onMapClick }: OnMapClickProps) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function SearchControl() {
  const map = useMap();

  useEffect(() => {
    const gc = geocoder({
      geocoder: new geocoders.Mapbox({
        apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
        geocodingQueryParams: {
          language: "es",
          country: "EC",
          proximity: `${map.getCenter().lng},${map.getCenter().lat}`,
        },
      }),
      defaultMarkGeocode: false,
      placeholder: "Buscar una dirección...",
      errorMessage: "No se encontraron resultados.",
      collapsed: false,
      suggestMinLength: 5,
      suggestTimeout: 600,
    })
      .on("markgeocode", (e) => {
        const latlng = e.geocode.center;
        map.flyTo(latlng, 15);
        gc.setQuery(e.geocode.name);
        gc.getContainer()?.querySelector("input")?.blur();
      })
      .addTo(map);

    return () => {
      map.removeControl(gc);
    };
  }, [map]);

  return null;
}

function MyLocateControl() {
  const map = useMap();

  useEffect(() => {
    const lc = new LocateControl({
      showPopup: false,
      flyTo: true,
      strings: {
        title: "Localizar mi ubicación",
      },
    }).addTo(map);
    return () => {
      map.removeControl(lc);
    };
  }, [map]);

  return null;
}

export default function Map({ markers, onMapClick }: MapProps) {
  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[-0.1807, -78.4678]} // Quito, Ecuador coordinates
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarkers markers={markers} />
        <OnMapClick onMapClick={onMapClick} />
        <SearchControl />
        <MyLocateControl />
      </MapContainer>
    </div>
  );
}
