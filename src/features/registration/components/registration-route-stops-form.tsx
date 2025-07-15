"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Markers } from "@/types";

const registrationRouteStopsSchema = registrationSchema.pick({
  location: true,
});

type RegistrationRouteStopsSchema = z.infer<
  typeof registrationRouteStopsSchema
>;

export default function RegistrationRouteStopsForm() {
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/map"), {
        loading: () => {
          return (
            <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Cargando mapa...</p>
            </div>
          );
        },
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

  const { setData } = useRegistrationStore();

  const loadData = useCallback(() => {
    const storedData = useRegistrationStore.getState();
    if (!storedData.email) {
      router.push("/registration/student-info");
    }
    if (storedData.location) {
      const formFields = Object.keys(
        registrationRouteStopsSchema.shape
      ) as (keyof RegistrationRouteStopsSchema)[];

      formFields.forEach((field) => {
        const value = storedData[field];
        if (value !== undefined) {
          setValue(field, value);
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
    }
  }, [router, setValue]);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated()) {
      useRegistrationStore.persist.onFinishHydration(() => {
        loadData();
        return;
      });
    }

    loadData();
  }, [loadData]);

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

  const onPrevious = () => {
    router.push("/registration/student-info");
  };

  const onSubmit = (data: RegistrationRouteStopsSchema) => {
    setData(data);
    router.push("/registration/billing-info");
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

  const handleRemoveMarker = (markerType: "morning" | "afternoon") => {
    setMarkers((prev) => ({
      ...prev,
      [markerType]: null,
      common: null,
    }));
    setValue(`location.${markerType}`, undefined);

    if (useSameLocation) {
      setUseSameLocation(false);
      setValue("location.afternoon", undefined);
      setMarkers((prev) => ({
        ...prev,
        afternoon: null,
      }));
    }
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
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-4 shadow-sm flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              {activeMarkerType === "morning" ? (
                <p className="text-sm">
                  <strong>Instrucciones:</strong> Haz clic en el mapa para
                  seleccionar la ubicación donde el estudiante será recogido en
                  la mañana.
                </p>
              ) : activeMarkerType === "afternoon" ? (
                <p className="text-sm">
                  <strong>Instrucciones:</strong> Haz clic en el mapa para
                  seleccionar la ubicación donde el estudiante será dejado en la
                  tarde.
                </p>
              ) : (
                <p className="text-sm">
                  <strong>Instrucciones:</strong> Seleccione primero el tipo de
                  parada (mañana o tarde) y luego haga clic en el mapa para
                  marcar la ubicación.
                </p>
              )}
            </div>
          </div>

          {/* Tip Section */}
          <div className="flex items-start text-sm text-gray-600 mb-4 p-2">
            <div className="flex-shrink-0 mr-2">
              <svg
                className="h-5 w-5 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a.75.75 0 01.75.75v1.25a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2ZM5.005 4.495a.75.75 0 01.03.03l.75.75a.75.75 0 01-1.06 1.06l-.75-.75a.75.75 0 011.03-1.09ZM14.995 4.495a.75.75 0 011.06 0l.75.75a.75.75 0 11-1.06 1.06l-.75-.75a.75.75 0 010-1.06ZM10 6a4 4 0 100 8 4 4 0 000-8ZM8.5 9.5a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5ZM12.25 9.5a.75.75 0 01-.75.75h-.01a.75.75 0 010-1.5h.01a.75.75 0 01.75.75ZM10 18a.75.75 0 01-.75-.75v-1.25a.75.75 0 011.5 0v1.25a.75.75 0 01-.75.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="italic">
              <strong>Tip:</strong> Usa la barra de búsqueda o el botón de
              localización para encontrar la dirección deseada.
            </p>
          </div>

          {/* Map */}
          <Map markers={markers} onMapClick={handleMapClick} />
          {errors.location && (
            <p className="text-sm text-red-600 mt-2">
              {errors.location.message}
            </p>
          )}

          {/* Selected locations display */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div
              className={`p-4 rounded-md transition-all ${
                markers.morning
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <h4 className="font-medium flex items-center mb-2">
                <span className="mr-2">🌅</span> Parada de la Mañana
              </h4>
              {markers.morning ? (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-green-700">
                    ✓ Ubicación seleccionada
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveMarker("morning")}
                    className="text-sm text-red-600 hover:text-red-800 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No seleccionada</p>
              )}
            </div>

            <div
              className={`p-4 rounded-md transition-all ${
                markers.afternoon
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <h4 className="font-medium flex items-center mb-2">
                <span className="mr-2">🌆</span> Parada de la Tarde
              </h4>
              {markers.afternoon ? (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-green-700">
                    ✓ Ubicación seleccionada
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveMarker("afternoon")}
                    className="text-sm text-red-600 hover:text-red-800 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
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
