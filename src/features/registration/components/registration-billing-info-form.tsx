"use client";

import { useForm } from "react-hook-form";
import { registrationSchema } from "../schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/app/registration/store";
import { useEffect } from "react";

const registrationBillingInfoSchema = registrationSchema.pick({
  billingInfo: true,
});

type RegistrationBillingInfoSchema = z.infer<
  typeof registrationBillingInfoSchema
>;

export default function RegistrationBillingInfoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationBillingInfoSchema>({
    resolver: zodResolver(registrationBillingInfoSchema),
  });

  const { setData, ...storedData } = useRegistrationStore((state) => state);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated) return;

    const formFields = Object.keys(
      registrationBillingInfoSchema.shape
    ) as (keyof RegistrationBillingInfoSchema)[];

    formFields.forEach((field) => {
      const value = storedData[field];
      if (value !== undefined) {
        setValue(field, value);
      }
    });
  }, [storedData, setValue]);

  const router = useRouter();

  const onPrevious = () => {
    router.push("/registration/route-stops");
  };

  const onSubmit = (data: RegistrationBillingInfoSchema) => {
    setData(data);
    console.log("Billing Info Data:", { ...storedData, ...data });
    alert(
      `Información de facturación guardada exitosamente:\n\n` +
        `Nombre: ${data.billingInfo.name} ${data.billingInfo.surname}\n` +
        `Documento: ${data.billingInfo.documentType} ${data.billingInfo.documentNumber}\n` +
        `Dirección: ${data.billingInfo.address}\n` +
        `Teléfono: ${data.billingInfo.phone}\n` +
        `Email: ${data.billingInfo.email}`
    );
    // Here you would typically handle the form submission, e.g., send data to an API
  };

  return (
    <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Información de Facturación
            </h3>
            <p className="text-gray-600 mb-6">
              Por favor ingrese los datos para la emisión de facturas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Billing Name */}
            <div className="space-y-2">
              <label
                htmlFor="billing-name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre *
              </label>
              <input
                {...register("billingInfo.name")}
                id="billing-name"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
              {errors.billingInfo?.name && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.name.message}
                </p>
              )}
            </div>

            {/* Billing Surname */}
            <div className="space-y-2">
              <label
                htmlFor="billing-surname"
                className="block text-sm font-medium text-gray-700"
              >
                Apellido *
              </label>
              <input
                {...register("billingInfo.surname")}
                id="billing-surname"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido"
              />
              {errors.billingInfo?.surname && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.surname.message}
                </p>
              )}
            </div>

            {/* Billing Document Type */}
            <div className="space-y-2">
              <label
                htmlFor="billing-document-type"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Documento *
              </label>
              <select
                {...register("billingInfo.documentType")}
                id="billing-document-type"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una opción</option>
                <option value="CÉDULA">CÉDULA</option>
                <option value="PASAPORTE">PASAPORTE</option>
                <option value="OTRO">OTRO</option>
              </select>
              {errors.billingInfo?.documentType && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.documentType.message}
                </p>
              )}
            </div>

            {/* Billing Document Number */}
            <div className="space-y-2">
              <label
                htmlFor="billing-document-number"
                className="block text-sm font-medium text-gray-700"
              >
                Número de Documento *
              </label>
              <input
                {...register("billingInfo.documentNumber")}
                id="billing-document-number"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de documento"
              />
              {errors.billingInfo?.documentNumber && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.documentNumber.message}
                </p>
              )}
            </div>

            {/* Billing Address */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="billing-address"
                className="block text-sm font-medium text-gray-700"
              >
                Dirección *
              </label>
              <input
                {...register("billingInfo.address")}
                id="billing-address"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dirección completa"
              />
              {errors.billingInfo?.address && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.address.message}
                </p>
              )}
            </div>

            {/* Billing Phone */}
            <div className="space-y-2">
              <label
                htmlFor="billing-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Teléfono *
              </label>
              <input
                {...register("billingInfo.phone")}
                id="billing-phone"
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 0991234567"
              />
              {errors.billingInfo?.phone && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.phone.message}
                </p>
              )}
            </div>

            {/* Billing Email */}
            <div className="space-y-2">
              <label
                htmlFor="billing-email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico *
              </label>
              <input
                {...register("billingInfo.email")}
                id="billing-email"
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
              />
              {errors.billingInfo?.email && (
                <p className="text-sm text-red-600">
                  {errors.billingInfo.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Legal information */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-6">
            <h4 className="font-medium text-gray-800 mb-2">
              Información Legal
            </h4>
            <p className="text-sm text-gray-600">
              La información proporcionada en este formulario será utilizada
              exclusivamente para fines de facturación según lo establecido en
              la normativa vigente. Los datos personales serán tratados con
              confidencialidad de acuerdo con nuestra política de privacidad.
            </p>
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
          className="px-8 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition font-bold"
        >
          Enviar Registro
        </button>
      </div>
    </form>
  );
}
