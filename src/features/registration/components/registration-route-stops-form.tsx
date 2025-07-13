"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Markers } from "@/types";

const registrationRouteStopsSchema = registrationSchema.pick({
  location: true,
});

type RegistrationRouteStopsSchema = z.infer<
  typeof registrationRouteStopsSchema
>;

export default function RegistrationRouteStopsForm() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/map"), {
        loading: () => <p>Cargando mapa...</p>,
        ssr: false,
      }),
    []
  );

  const [markers, setMarkers] = useState<Markers>({
    morning: null,
    afternoon: null,
    common: null,
  });

  const [activeMarkerType, setActiveMarkerType] = useState<
    "morning" | "afternoon" | null
  >(null);

  const [useSameLocation, setUseSameLocation] = useState(false);

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationRouteStopsSchema>({
    resolver: zodResolver(registrationRouteStopsSchema),
    defaultValues: {
      location: {
        morning: undefined,
        afternoon: undefined,
      },
    },
  });

  const location = watch("location");

  const { setData, ...storedData } = useRegistrationStore((state) => state);

  // useEffect(() => {
  //   if (!useRegistrationStore.persist.hasHydrated) return;

  //   const formFields = Object.keys(
  //     registrationRouteStopsSchema.shape
  //   ) as (keyof RegistrationRouteStopsSchema)[];

  //   formFields.forEach((field) => {
  //     const value = storedData[field];
  //     if (value !== undefined) {
  //       setValue(field, value);
  //     }
  //   });
  // }, [storedData, setValue]);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated) return;

    const formFields = Object.keys(
      registrationRouteStopsSchema.shape
    ) as (keyof RegistrationRouteStopsSchema)[];

    formFields.forEach((field) => {
      const value = storedData[field];
      if (value !== undefined) {
        let storedMarkers: Markers;
        if (
          value.morning !== undefined &&
          value.afternoon !== undefined &&
          value.morning.lat === value.afternoon.lat &&
          value.morning.lng === value.afternoon.lng
        ) {
          setUseSameLocation(true);
          storedMarkers = {
            morning: {
              latlng: value.morning,
              color: "#FFC107",
              popupContent: "Parada de la Mañana",
            },
            afternoon: {
              latlng: value.afternoon,
              color: "#3B82F6",
              popupContent: "Parada de la Tarde",
            },
            common: {
              latlng: value.morning,
              color: "#8B5CF6",
              popupContent: "Parada de la Mañana y Tarde",
            },
          };
        } else {
          storedMarkers = {
            morning: value.morning
              ? {
                  latlng: value.morning,
                  color: "#FFC107",
                  popupContent: "Parada de la Mañana",
                }
              : null,
            afternoon: value.afternoon
              ? {
                  latlng: value.afternoon,
                  color: "#3B82F6",
                  popupContent: "Parada de la Tarde",
                }
              : null,
            common: null,
          };
        }
        setMarkers(storedMarkers);
      }
    });
  }, [storedData]);

  useEffect(() => {
    if (useSameLocation) {
      setValue("location.afternoon", location.morning);
      setMarkers((prev) => ({
        ...prev,
        afternoon: prev.morning
          ? {
              ...prev.morning,
              color: "#3B82F6",
              popupContent: "Parada de la Tarde",
            }
          : null,
        common: prev.morning
          ? {
              ...prev.morning,
              color: "#8B5CF6",
              popupContent: "Parada de la Mañana y Tarde",
            }
          : null,
      }));
      if (activeMarkerType === "afternoon") {
        setActiveMarkerType("morning");
      }
    }
  }, [useSameLocation, location.morning, setValue, activeMarkerType]);

  const onUncheckedChange = () => {
    setValue("location.afternoon", undefined);
    setMarkers((prev) => ({
      ...prev,
      afternoon: null,
      common: null,
    }));
  };
  const router = useRouter();

  const onPrevious = () => {
    router.push("/registration/student-info");
  };

  const onSubmit = (data: RegistrationRouteStopsSchema) => {
    setData(data);
    console.log("Form submitted with data:", data);
    // router.push("/registration/billing-info");
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!activeMarkerType) return;

    const newMarker = {
      latlng: { lat, lng },
      color: activeMarkerType === "morning" ? "#FFC107" : "#3B82F6",
      popupContent: `Parada de la ${
        activeMarkerType === "morning" ? "Mañana" : "Tarde"
      }`,
    };

    setMarkers((prev) => ({
      ...prev,
      [activeMarkerType]: newMarker,
    }));
    setValue("location", {
      ...location,
      [activeMarkerType]: { lat, lng },
    });
  };
  return (
    <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Selección de Paradas
            </h3>
            <p className="text-gray-600 mb-6">
              Seleccione las ubicaciones donde el estudiante será recogido y
              dejado por el transporte escolar
            </p>
          </div>

          {/* Marker type selector */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setActiveMarkerType("morning")}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeMarkerType === "morning"
                  ? "bg-yellow-100 border-2 border-yellow-400 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className="mr-2">🌅</span>
              Parada de la Mañana
            </button>

            <button
              type="button"
              onClick={() => setActiveMarkerType("afternoon")}
              disabled={useSameLocation}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeMarkerType === "afternoon"
                  ? "bg-blue-100 border-2 border-blue-400 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              } ${useSameLocation ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="mr-2">🌆</span>
              Parada de la Tarde
            </button>
          </div>

          {/* Same location checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="sameLocation"
              checked={useSameLocation}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setUseSameLocation(e.target.checked);
                if (!isChecked) {
                  onUncheckedChange();
                }
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="sameLocation"
              className="ml-2 block text-sm text-gray-900"
            >
              Usar la misma ubicación para la parada de la tarde
            </label>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            {activeMarkerType === "morning" ? (
              <p className="text-sm text-gray-700">
                <strong>Instrucciones:</strong> Haz clic en el mapa para
                seleccionar la ubicación donde el estudiante será recogido en la
                mañana.
              </p>
            ) : activeMarkerType === "afternoon" ? (
              <p className="text-sm text-gray-700">
                <strong>Instrucciones:</strong> Haz clic en el mapa para
                seleccionar la ubicación donde el estudiante será dejado en la
                tarde.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                <strong>Instrucciones:</strong> Seleccione primero el tipo de
                parada (mañana o tarde) y luego haga clic en el mapa para marcar
                la ubicación.
              </p>
            )}
          </div>

          {/* Map */}
          <Map markers={markers} onMapClick={handleMapClick} />
          {errors.location && (
            <p className="text-sm text-red-600 mt-2">
              {errors.location.message}
            </p>
          )}

          {/* Selected locations display */}
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-md ${
                markers.morning
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <h4 className="font-medium flex items-center mb-1">
                <span className="mr-2">🌅</span> Parada de la Mañana
              </h4>
              {markers.morning ? (
                <p className="text-sm">
                  Ubicación: {markers.morning.latlng.lat.toFixed(6)},{" "}
                  {markers.morning.latlng.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No seleccionada</p>
              )}
            </div>

            <div
              className={`p-4 rounded-md ${
                markers.afternoon
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <h4 className="font-medium flex items-center mb-1">
                <span className="mr-2">🌆</span> Parada de la Tarde
              </h4>
              {markers.afternoon ? (
                <p className="text-sm">
                  Ubicación: {markers.afternoon.latlng.lat.toFixed(6)},{" "}
                  {markers.afternoon.latlng.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No seleccionada</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}
