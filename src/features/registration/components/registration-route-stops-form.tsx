"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const registrationRouteStopsSchema = registrationSchema.pick({
  morningLocation: true,
  afternoonLocation: true,
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationRouteStopsSchema>({
    resolver: zodResolver(registrationRouteStopsSchema),
  });

  const { setData, ...storedData } = useRegistrationStore((state) => state);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated) return;

    const formFields = Object.keys(
      registrationRouteStopsSchema.shape
    ) as (keyof RegistrationRouteStopsSchema)[];

    formFields.forEach((field) => {
      const value = storedData[field];
      if (value !== undefined) {
        setValue(field, value);
      }
    });
  }, [storedData, setValue]);

  const router = useRouter();

  const onPrevious = () => {
    router.push("/registration/student-info");
  };

  const onSubmit = (data: RegistrationRouteStopsSchema) => {
    setData(data);
    router.push("/registration/billing-info");
  };
  return (
    <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <p className="text-gray-600">Registration route stops form.</p>
        <Map />
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
