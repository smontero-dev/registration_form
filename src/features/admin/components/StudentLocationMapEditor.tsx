"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { geocoder, geocoders } from "leaflet-control-geocoder";
import { LocateControl } from "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import { LocationDetail } from "@/types";

interface StudentLocationMapEditorProps {
  morningLocation?: Partial<LocationDetail>;
  afternoonLocation?: Partial<LocationDetail>;
  activePeriod: "morning" | "afternoon";
  useSameMorningLocation?: boolean;
  onLocationChange: (
    period: "morning" | "afternoon",
    lat: number,
    lng: number
  ) => void;
}

const createSvgIcon = (color: string, label: string) => {
  const markerHtml = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <svg width="28" height="41" viewBox="0 0 28 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 41 14 41S28 24.5 28 14C28 6.268 21.732 0 14 0Z"
          fill="${color}"
          stroke="white"
          stroke-width="2"
        />
        <circle cx="14" cy="14" r="6" fill="white" />
      </svg>
      <span style="
        position: absolute;
        top: -18px;
        background-color: ${color};
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: 9999px;
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      ">${label}</span>
    </div>
  `;
  return L.divIcon({
    html: markerHtml,
    className: "",
    iconSize: [28, 41],
    iconAnchor: [14, 41],
    popupAnchor: [0, -38],
  });
};

function MapClickHandler({
  activePeriod,
  useSameMorningLocation,
  onLocationChange,
}: {
  activePeriod: "morning" | "afternoon";
  useSameMorningLocation?: boolean;
  onLocationChange: (
    period: "morning" | "afternoon",
    lat: number,
    lng: number
  ) => void;
}) {
  useMapEvents({
    click(e) {
      if (useSameMorningLocation) {
        onLocationChange("morning", e.latlng.lat, e.latlng.lng);
        onLocationChange("afternoon", e.latlng.lat, e.latlng.lng);
      } else {
        onLocationChange(activePeriod, e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapControls() {
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
      placeholder: "Buscar dirección o punto de referencia...",
      errorMessage: "No se encontraron resultados.",
      collapsed: false,
      suggestMinLength: 3,
      suggestTimeout: 400,
    })
      .on("markgeocode", (e: any) => {
        const latlng = e.geocode.center;
        map.flyTo(latlng, 16);
        gc.setQuery(e.geocode.name);
        gc.getContainer()?.querySelector("input")?.blur();
      })
      .addTo(map);

    const lc = new LocateControl({
      showPopup: false,
      flyTo: true,
      strings: {
        title: "Localizar mi ubicación",
      },
    }).addTo(map);

    return () => {
      map.removeControl(gc);
      map.removeControl(lc);
    };
  }, [map]);

  return null;
}

function RecenterMap({
  activePeriod,
  useSameMorningLocation,
  morningLocation,
  afternoonLocation,
}: {
  activePeriod: "morning" | "afternoon";
  useSameMorningLocation?: boolean;
  morningLocation?: Partial<LocationDetail>;
  afternoonLocation?: Partial<LocationDetail>;
}) {
  const map = useMap();
  const lastActiveRef = useRef<string>("");

  useEffect(() => {
    const currentKey = `${activePeriod}-${useSameMorningLocation}`;
    if (lastActiveRef.current === currentKey) return;
    lastActiveRef.current = currentKey;

    const targetLoc =
      useSameMorningLocation || activePeriod === "morning"
        ? morningLocation
        : afternoonLocation;
    const lat = Number(targetLoc?.lat);
    const lng = Number(targetLoc?.lng);

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      map.panTo([lat, lng]);
    }
  }, [activePeriod, useSameMorningLocation, morningLocation, afternoonLocation, map]);

  return null;
}

export default function StudentLocationMapEditor({
  morningLocation,
  afternoonLocation,
  activePeriod,
  useSameMorningLocation = false,
  onLocationChange,
}: StudentLocationMapEditorProps) {
  const morningLat = Number(morningLocation?.lat);
  const morningLng = Number(morningLocation?.lng);
  const hasMorning =
    !isNaN(morningLat) && !isNaN(morningLng) && morningLat !== 0 && morningLng !== 0;

  const afternoonLat = Number(afternoonLocation?.lat);
  const afternoonLng = Number(afternoonLocation?.lng);
  const hasAfternoon =
    !isNaN(afternoonLat) && !isNaN(afternoonLng) && afternoonLat !== 0 && afternoonLng !== 0;

  const initialCenter = useMemo<[number, number]>(() => {
    if (hasMorning) return [morningLat, morningLng];
    if (hasAfternoon) return [afternoonLat, afternoonLng];
    return [-0.1807, -78.4678]; // Default Quito
  }, [hasMorning, hasAfternoon, morningLat, morningLng, afternoonLat, afternoonLng]);

  const morningIcon = useMemo(() => createSvgIcon("#2563EB", "Mañana"), []);
  const afternoonIcon = useMemo(() => createSvgIcon("#3B82F6", "Tarde"), []);
  const commonIcon = useMemo(() => createSvgIcon("#8B5CF6", "Mañana y Tarde"), []);

  return (
    <div className="relative w-full h-[340px] rounded-lg overflow-hidden border border-gray-300 shadow-inner">
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          activePeriod={activePeriod}
          useSameMorningLocation={useSameMorningLocation}
          onLocationChange={onLocationChange}
        />

        <MapControls />

        <RecenterMap
          activePeriod={activePeriod}
          useSameMorningLocation={useSameMorningLocation}
          morningLocation={morningLocation}
          afternoonLocation={afternoonLocation}
        />

        {useSameMorningLocation ? (
          hasMorning && (
            <Marker
              position={[morningLat, morningLng]}
              icon={commonIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  onLocationChange("morning", position.lat, position.lng);
                  onLocationChange("afternoon", position.lat, position.lng);
                },
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>Parada Mañana y Tarde</strong>
                  <br />
                  {morningLocation?.mainStreet || "Sin dirección"}
                  <br />
                  <span className="text-gray-500">
                    (Arrastra el pin o haz clic en el mapa para mover ambas paradas)
                  </span>
                </div>
              </Popup>
            </Marker>
          )
        ) : (
          <>
            {hasMorning && (
              <Marker
                position={[morningLat, morningLng]}
                icon={morningIcon}
                draggable={activePeriod === "morning"}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    onLocationChange("morning", position.lat, position.lng);
                  },
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>Parada Mañana</strong>
                    <br />
                    {morningLocation?.mainStreet || "Sin dirección"}
                    <br />
                    <span className="text-gray-500">
                      {activePeriod === "morning"
                        ? "(Arrastra el pin o haz clic en el mapa)"
                        : "(Activa pestaña Mañana para editar)"}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )}

            {hasAfternoon && (
              <Marker
                position={[afternoonLat, afternoonLng]}
                icon={afternoonIcon}
                draggable={activePeriod === "afternoon"}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    onLocationChange("afternoon", position.lat, position.lng);
                  },
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>Parada Tarde</strong>
                    <br />
                    {afternoonLocation?.mainStreet || "Sin dirección"}
                    <br />
                    <span className="text-gray-500">
                      {activePeriod === "afternoon"
                        ? "(Arrastra el pin o haz clic en el mapa)"
                        : "(Activa pestaña Tarde para editar)"}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
}
