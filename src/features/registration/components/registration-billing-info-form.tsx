"use client";

import { useForm } from "react-hook-form";
import { registrationSchema } from "../schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/app/registration/store";
import { useCallback, useEffect } from "react";
import { titleCase } from "title-case";

const registrationBillingInfoSchema = registrationSchema.pick({
  billingInfo: true,
});

type RegistrationBillingInfoSchema = z.infer<
  typeof registrationBillingInfoSchema
>;

export default function RegistrationBillingInfoForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrationBillingInfoSchema>({
    resolver: zodResolver(registrationBillingInfoSchema),
  });

  const setData = useRegistrationStore((state) => state.setData);

  const checkAndRedirect = useCallback(() => {
    const storedData = useRegistrationStore.getState();

    if (!storedData.email) {
      router.push("/registration/student-info");
    } else if (!storedData.location) {
      router.push("/registration/route-stops");
    }

    const formFields = Object.keys(
      registrationBillingInfoSchema.shape
    ) as (keyof RegistrationBillingInfoSchema)[];

    formFields.forEach((field) => {
      const value = storedData[field];
      if (value !== undefined) {
        setValue(field, value);
      }
    });
  }, [setValue, router]);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated()) {
      const unsubscribe = useRegistrationStore.persist.onHydrate(() => {
        checkAndRedirect();
      });
      return unsubscribe;
    }
    checkAndRedirect();
  }, [checkAndRedirect]);

  const onPrevious = () => {
    router.push("/registration/route-stops");
  };

  const onSubmit = (data: RegistrationBillingInfoSchema) => {
    const formattedData: RegistrationBillingInfoSchema = {
      billingInfo: {
        address: data.billingInfo.address.trim(),
        documentNumber: data.billingInfo.documentNumber.trim(),
        documentType: data.billingInfo.documentType,
        email: data.billingInfo.email.trim(),
        name: titleCase(data.billingInfo.name.trim().toLowerCase()),
        phone: data.billingInfo.phone.trim(),
        surname: titleCase(data.billingInfo.surname.trim().toLowerCase()),
      },
    };
    setData(formattedData);
    reset();
    router.push("/registration/contract-signing");
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
                Nombres *
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
                Apellidos *
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
              confidencialidad de acuerdo con nuestra política de privacidad y
              en cumplimiento con la Ley Orgánica de Protección de Datos
              Personales (LOPDP) de Ecuador, que garantiza el derecho a la
              protección de datos personales, incluyendo su acceso,
              rectificación, eliminación, y oposición. Como titular de los
              datos, usted tiene derecho a ser informado sobre el uso de sus
              datos, a acceder a ellos, y a presentar reclamos ante la autoridad
              competente en caso de incumplimiento de la ley.
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
          className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}
