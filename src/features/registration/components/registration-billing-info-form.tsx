"use client";

import { useForm } from "react-hook-form";
import { registrationSchema } from "../schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/app/registration/store";
import { useCallback, useEffect, useState } from "react";
import { titleCase } from "title-case";
import axios from "axios";
import { addRegistration } from "@/services/registrationService";

const registrationBillingInfoSchema = registrationSchema.pick({
  billingInfo: true,
});

type RegistrationBillingInfoSchema = z.infer<
  typeof registrationBillingInfoSchema
>;

export default function RegistrationBillingInfoForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
    } else if (!storedData.locations) {
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

  const onSubmit = async (data: RegistrationBillingInfoSchema) => {
    setIsSubmitting(true);
    setApiError(null);

    const formattedBillingInfo = {
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

    const storedData = useRegistrationStore.getState();
    const isExistingWithPriceInitial =
      !storedData.isNewStudent &&
      Boolean(storedData.price) &&
      Number(storedData.price) > 0;

    const signatureType = isExistingWithPriceInitial
      ? "ONLINE_SIGNATURE"
      : "TO_BE_SIGNED_IN_PERSON";

    const finalData = {
      ...storedData,
      ...formattedBillingInfo,
      signatureType,
    };

    try {
      const response = await addRegistration(finalData);
      const targetDoc = response.documentNumber || finalData.documentNumber || "";
      const targetSchoolYear = response.schoolYear || finalData.schoolYear || "";

      const isExistingWithPrice =
        !finalData.isNewStudent &&
        Boolean(finalData.price) &&
        Number(finalData.price) > 0;

      // Clear persistent storage immediately after backend persistence
      useRegistrationStore.persist.clearStorage();
      reset();

      if (isExistingWithPrice) {
        router.push(
          `/registration/contract-signing?doc=${encodeURIComponent(
            targetDoc
          )}&schoolYear=${encodeURIComponent(targetSchoolYear)}`
        );
      } else {
        router.push("/registration/office-redirect");
      }
    } catch (error) {
      console.error("Error submitting registration at billing step:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;
        const serverMessage =
          typeof responseData === "string"
            ? responseData
            : responseData?.message || responseData?.error || "";

        if (
          status === 400 &&
          typeof serverMessage === "string" &&
          serverMessage.startsWith("Form already exists")
        ) {
          setApiError(
            "Ya existe un registro para este estudiante en este año lectivo. Si necesita editar la información, por favor diríjase a la oficina de transporte escolar."
          );
        } else if (error.response) {
          setApiError(
            "No se pudo completar el registro debido a un problema en el servidor. Por favor, verifique sus datos o intente nuevamente más tarde."
          );
        } else {
          setApiError(
            "No fue posible conectar con el servidor. Por favor, verifique su conexión a internet e intente nuevamente."
          );
        }
      } else {
        setApiError(
          "Ocurrió un error inesperado en la aplicación. Por favor, intente nuevamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{apiError}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
        >
          {isSubmitting ? "Guardando..." : "Siguiente →"}
        </button>
      </div>
    </form>
  );
}
