"use client";

import LocationMarkers from "@/components/ui/LocationMarkers";
import { Marker, Student } from "@/types";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import ToggleControl from "./ToggleControl";
import { titleCase } from "title-case";

type ViewMode = "morning" | "both" | "afternoon";

type MapSectionProps = {
  students: Student[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export default function MapSection({
  students,
  viewMode,
  setViewMode,
}: MapSectionProps) {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/raw_map"), {
        loading: () => {
          return (
            <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Cargando mapa...</p>
            </div>
          );
        },
        ssr: false,
      }),
    []
  );

  const markers = students.reduce((acc, student) => {
    const content = (
      <strong>
        {titleCase(
          `${student.studentSurname.trim().toLowerCase()}, ${student.studentName
            .trim()
            .toLowerCase()}`
        )}
      </strong>
    );

    if (
      viewMode === "both" &&
      student.location.morning.lat &&
      student.location.morning.lng &&
      student.location.afternoon.lat &&
      student.location.afternoon.lng &&
      student.location.morning.lat === student.location.afternoon.lat &&
      student.location.morning.lng === student.location.afternoon.lng
    ) {
      acc.push({
        id: student.id,
        lat: parseFloat(student.location.morning.lat),
        lng: parseFloat(student.location.morning.lng),
        color: "purple",
        popupContent: (
          <div className="text-center">
            {content} <br />
            <span>Mañana - Tarde</span>
          </div>
        ),
      });

      return acc;
    }

    // Add morning marker if mode allows it
    if (
      (viewMode === "morning" || viewMode === "both") &&
      student.location.morning.lat &&
      student.location.morning.lng
    ) {
      acc.push({
        id: `${student.id}-morning`,
        lat: parseFloat(student.location.morning.lat),
        lng: parseFloat(student.location.morning.lng),
        color:
          viewMode === "both"
            ? "purple"
            : student.routes?.find((route) => route.period === "morning")
                ?.color || "gray",
        popupContent: (
          <div className="text-center">
            {content} <br />
            <span>Mañana</span>
            <br />
            {viewMode === "morning" &&
              student.routes?.find((route) => route.period === "morning") && (
                <strong>
                  {
                    student.routes.find((route) => route.period === "morning")
                      ?.name
                  }
                </strong>
              )}
          </div>
        ),
      });
    }

    // Add afternoon marker if mode allows it
    if (
      (viewMode === "afternoon" || viewMode === "both") &&
      student.location.afternoon.lat &&
      student.location.afternoon.lng
    ) {
      acc.push({
        id: `${student.id}-afternoon`,
        lat: parseFloat(student.location.afternoon.lat),
        lng: parseFloat(student.location.afternoon.lng),
        color:
          viewMode === "both"
            ? "purple"
            : student.routes?.find((route) => route.period === "afternoon")
                ?.color || "gray",
        popupContent: (
          <div className="text-center">
            {content} <br />
            <span>Tarde</span>
            <br />
            {viewMode === "afternoon" &&
              student.routes?.find((route) => route.period === "afternoon") && (
                <strong>
                  {
                    student.routes.find((route) => route.period === "afternoon")
                      ?.name
                  }
                </strong>
              )}
          </div>
        ),
      });
    }

    return acc;
  }, [] as Marker[]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Ubicaciones de Estudiantes
          </h2>
          <ToggleControl viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <Map>
          <LocationMarkers markers={markers} />
        </Map>
      </div>
    </div>
  );
}
