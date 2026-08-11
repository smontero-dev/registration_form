"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CustomMarkers, LocationDetail } from "@/types";

const registrationRouteStopsSchema = registrationSchema.pick({
  locations: true,
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

  const [markers, setMarkers] = useState<CustomMarkers>({
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
    register,
    subscribe,
    reset,
    formState: { errors },
  } = useForm<RegistrationRouteStopsSchema>({
    resolver: zodResolver(registrationRouteStopsSchema),
    defaultValues: {
      locations: {
        morning: undefined,
        afternoon: undefined,
      },
    },
  });

  const locations = watch("locations");

  const { setData } = useRegistrationStore();

  const loadData = useCallback(() => {
    const storedData = useRegistrationStore.getState();
    if (!storedData.email) {
      router.push("/registration/student-info");
    }
    if (storedData.locations) {
      const formFields = Object.keys(
        registrationRouteStopsSchema.shape
      ) as (keyof RegistrationRouteStopsSchema)[];

      formFields.forEach((field) => {
        const value = storedData[field];
        if (value !== undefined) {
          setValue(field, value);
          if (field === "locations") {
            const storedLocations =
              value as RegistrationRouteStopsSchema["locations"];
            let storedMarkers: CustomMarkers;
            if (
              storedLocations.morning?.lat !== undefined &&
              storedLocations.afternoon?.lat !== undefined &&
              storedLocations.morning.lat === storedLocations.afternoon.lat &&
              storedLocations.morning.lng === storedLocations.afternoon.lng
            ) {
              setUseSameLocation(true);
              storedMarkers = {
                morning: {
                  latlng: { lat: storedLocations.morning.lat, lng: storedLocations.morning.lng },
                  color: "#FFC107",
                  popupContent: "Parada de la Mañana",
                },
                afternoon: {
                  latlng: { lat: storedLocations.afternoon.lat, lng: storedLocations.afternoon.lng },
                  color: "#3B82F6",
                  popupContent: "Parada de la Tarde",
                },
                common: {
                  latlng: { lat: storedLocations.morning.lat, lng: storedLocations.morning.lng },
                  color: "#8B5CF6",
                  popupContent: "Parada de la Mañana y Tarde",
                },
              };
            } else {
              storedMarkers = {
                morning: storedLocations.morning?.lat && storedLocations.morning?.lng
                  ? {
                    latlng: { lat: storedLocations.morning.lat, lng: storedLocations.morning.lng },
                    color: "#FFC107",
                    popupContent: "Parada de la Mañana",
                  }
                  : null,
                afternoon: storedLocations.afternoon?.lat && storedLocations.afternoon?.lng
                  ? {
                    latlng: { lat: storedLocations.afternoon.lat, lng: storedLocations.afternoon.lng },
                    color: "#3B82F6",
                    popupContent: "Parada de la Tarde",
                  }
                  : null,
                common: null,
              };
            }
            setMarkers(storedMarkers);
          }
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

  const syncAfternoonWithMorning = useCallback(
    (morningData?: LocationDetail) => {
      if (!morningData) {
        setValue("locations.afternoon", undefined);
        return;
      }
      setValue("locations.afternoon.lat", morningData.lat, { shouldValidate: true });
      setValue("locations.afternoon.lng", morningData.lng, { shouldValidate: true });
      setValue("locations.afternoon.mainStreet", morningData.mainStreet || "", { shouldValidate: true });
      setValue("locations.afternoon.secondaryStreet", morningData.secondaryStreet || "", { shouldValidate: true });
      setValue("locations.afternoon.neighborhood", morningData.neighborhood || "", { shouldValidate: true });
      setValue("locations.afternoon.referencePoints", morningData.referencePoints || "", { shouldValidate: true });
    },
    [setValue]
  );

  useEffect(() => {
    if (useSameLocation) {
      if (locations?.morning) {
        syncAfternoonWithMorning(locations.morning);
      } else {
        setValue("locations.afternoon", undefined);
      }

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
  }, [useSameLocation, locations?.morning, syncAfternoonWithMorning, activeMarkerType, setValue]);

  useEffect(() => {
    const callback = subscribe({
      name: ["locations.morning"],
      callback: ({ values }) => {
        if (useSameLocation) {
          if (values.locations?.morning) {
            syncAfternoonWithMorning(values.locations.morning);
          } else {
            setValue("locations.afternoon", undefined);
          }
        }
      },
    });

    return () => callback();
  }, [subscribe, useSameLocation, syncAfternoonWithMorning, setValue]);

  const onUncheckedChange = () => {
    setValue("locations.afternoon", undefined);
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
    const cleanLocations = {
      morning:
        data.locations.morning?.lat !== undefined && data.locations.morning?.lng !== undefined
          ? data.locations.morning
          : undefined,
      afternoon:
        data.locations.afternoon?.lat !== undefined && data.locations.afternoon?.lng !== undefined
          ? data.locations.afternoon
          : undefined,
    };
    setData({ locations: cleanLocations });
    reset();
    router.push("/registration/billing-info");
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!activeMarkerType) return;

    const newMarker = {
      latlng: { lat, lng },
      color: activeMarkerType === "morning" ? "#FFC107" : "#3B82F6",
      popupContent: `Parada de la ${activeMarkerType === "morning" ? "Mañana" : "Tarde"
        }`,
    };

    setMarkers((prev) => ({
      ...prev,
      [activeMarkerType]: newMarker,
    }));
    setValue("locations", {
      ...locations,
      [activeMarkerType]: {
        ...locations?.[activeMarkerType],
        lat,
        lng,
      },
    });
  };

  const handleRemoveMarker = (markerType: "morning" | "afternoon") => {
    setMarkers((prev) => ({
      ...prev,
      [markerType]: null,
      common: null,
    }));
    setValue(`locations.${markerType}`, undefined);

    if (useSameLocation) {
      setUseSameLocation(false);
      setValue("locations.afternoon", undefined);
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
              className={`px-4 py-2 rounded-md flex items-center ${activeMarkerType === "morning"
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
              className={`px-4 py-2 rounded-md flex items-center ${activeMarkerType === "afternoon"
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
          <div
            className={`border-l-4 p-4 rounded-md mb-4 shadow-sm flex items-start ${!activeMarkerType
                ? "bg-orange-50 border-orange-400 text-orange-800"
                : "bg-teal-50 border-teal-500 text-teal-800"
              }`}
          >
            <div className="flex-shrink-0">
              <svg
                className={`h-5 w-5 ${!activeMarkerType ? "text-orange-400" : "text-teal-500"
                  }`}
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
          {errors.locations && (
            <p className="text-sm text-red-600 mt-2">
              {errors.locations.message}
            </p>
          )}

          {/* Selected locations display */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div
              className={`p-4 rounded-md transition-all shadow-sm ${markers.morning
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-gray-50 border border-gray-200"
                }`}
            >
              <h4 className="font-medium flex items-center mb-3 text-yellow-800">
                <span className="mr-2">🌅</span> Parada de la Mañana
              </h4>
              {markers.morning ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-green-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Ubicación seleccionada
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveMarker("morning")}
                      className="text-sm text-red-600 hover:text-red-800 font-semibold flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>

                  <div className="mb-3 p-2 bg-yellow-50 border-l-2 border-yellow-400 text-yellow-700 text-sm">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Importante:</strong> Complete la información de
                        la dirección para ayudar al conductor a ubicar
                        exactamente la parada. Estos detalles complementan la
                        ubicación del mapa.
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección Principal / Calle *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.morning.mainStreet")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.locations?.morning?.mainStreet
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                            }`}
                          placeholder="Ej: Av. 9 de Octubre y Boyacá"
                        />
                      </div>
                      {errors.locations?.morning?.mainStreet && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.locations.morning.mainStreet.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección Secundaria (Opcional)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.morning.secondaryStreet")}
                          className="block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          placeholder="Ej: Edificio Torres del Sol, Piso 5, Apto 502"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barrio / Sector *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.morning.neighborhood")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.locations?.morning?.neighborhood
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                            }`}
                          placeholder="Ej: Kennedy Norte"
                        />
                      </div>
                      {errors.locations?.morning?.neighborhood && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.locations.morning.neighborhood.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos de Referencia (Opcional)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.morning.referencePoints")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.locations?.morning?.referencePoints
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                            }`}
                          placeholder="Ej: Cerca del parque Kennedy, frente al Banco Pichincha"
                        />
                      </div>
                      {errors.locations?.morning?.referencePoints && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.locations.morning.referencePoints.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No seleccionada</p>
              )}
            </div>

            <div
              className={`p-4 rounded-md transition-all shadow-sm ${markers.afternoon
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
                }`}
            >
              <h4 className="font-medium flex items-center mb-3 text-blue-800">
                <span className="mr-2">🌆</span> Parada de la Tarde
              </h4>
              {markers.afternoon ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-green-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Ubicación seleccionada
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveMarker("afternoon")}
                      className="text-sm text-red-600 hover:text-red-800 font-semibold flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>

                  <div className="mb-3 p-2 bg-blue-50 border-l-2 border-blue-400 text-blue-700 text-sm">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Importante:</strong> Complete la información de
                        la dirección para ayudar al conductor a ubicar
                        exactamente la parada. Estos detalles complementan la
                        ubicación del mapa.
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección Principal / Calle *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.afternoon.mainStreet")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.locations?.afternoon?.mainStreet
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                            } ${useSameLocation
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            }`}
                          disabled={useSameLocation}
                          placeholder="Ej: Av. 9 de Octubre y Boyacá"
                        />
                      </div>
                      {errors.locations?.afternoon?.mainStreet && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.locations.afternoon.mainStreet.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección Secundaria (Opcional)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.afternoon.secondaryStreet")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${useSameLocation
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            }`}
                          disabled={useSameLocation}
                          placeholder="Ej: Edificio Torres del Sol, Piso 5, Apto 502"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barrio / Sector *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.afternoon.neighborhood")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.locations?.afternoon?.neighborhood
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                            } ${useSameLocation
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            }`}
                          disabled={useSameLocation}
                          placeholder="Ej: Kennedy Norte"
                        />
                      </div>
                      {errors.locations?.afternoon?.neighborhood && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.locations.afternoon.neighborhood.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos de Referencia (Opcional)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          {...register("locations.afternoon.referencePoints")}
                          className={`block w-full rounded-md border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm ${errors.locations?.afternoon?.referencePoints
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : ""
                            } ${useSameLocation
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            }`}
                          disabled={useSameLocation}
                          placeholder="Ej: Cerca del parque Kennedy, frente al Banco Pichincha"
                        />
                      </div>
                      {errors.locations?.afternoon?.referencePoints && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.locations.afternoon.referencePoints.message}
                        </p>
                      )}
                    </div>
                  </div>
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
