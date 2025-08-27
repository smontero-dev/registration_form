"use client";

import { useForm } from "react-hook-form";
import { registrationSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { titleCase } from "title-case";

const registrationStudentInfoSchema = registrationSchema.pick({
  email: true,
  studentName: true,
  studentSurname: true,
  documentType: true,
  documentNumber: true,
  grade: true,
  parentPhone: true,
  secondaryPhone: true,
  housePhone: true,
  additionalInfo: true,
  isNewStudent: true,
});

type RegistrationStudentInfoSchema = z.infer<
  typeof registrationStudentInfoSchema
>;

export default function RegistrationStudentInfoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrationStudentInfoSchema>({
    resolver: zodResolver(registrationStudentInfoSchema),
    defaultValues: {
      isNewStudent: false,
    },
  });

  const { setData, ...storedData } = useRegistrationStore((state) => state);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated) return;

    const formFields = Object.keys(
      registrationStudentInfoSchema.shape
    ) as (keyof RegistrationStudentInfoSchema)[];

    formFields.forEach((field) => {
      const value = storedData[field];
      if (value !== undefined) {
        setValue(field, value);
      }
    });
  }, [storedData, setValue]);

  const router = useRouter();

  const onSubmit = (data: RegistrationStudentInfoSchema) => {
    const formattedData: RegistrationStudentInfoSchema = {
      ...data,
      studentName: titleCase(data.studentName.trim().toLowerCase()),
      studentSurname: titleCase(data.studentSurname.trim().toLowerCase()),
      email: data.email.trim(),
    };
    setData(formattedData);
    reset();
    router.push("/registration/route-stops");
  };

  return (
    <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div className="space-y-2">
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700"
              >
                Nombres del Estudiante *
              </label>
              <input
                {...register("studentName")}
                id="studentName"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del estudiante"
              />
              {errors.studentName && (
                <p className="text-sm text-red-600">
                  {errors.studentName.message}
                </p>
              )}
            </div>

            {/* Student Surname */}
            <div className="space-y-2">
              <label
                htmlFor="studentSurname"
                className="block text-sm font-medium text-gray-700"
              >
                Apellidos del Estudiante *
              </label>
              <input
                {...register("studentSurname")}
                id="studentSurname"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido del estudiante"
              />
              {errors.studentSurname && (
                <p className="text-sm text-red-600">
                  {errors.studentSurname.message}
                </p>
              )}
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Documento *
              </label>
              <select
                {...register("documentType")}
                id="documentType"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una opción</option>
                <option value="CÉDULA">CÉDULA</option>
                <option value="PASAPORTE">PASAPORTE</option>
                <option value="OTRO">OTRO</option>
              </select>
              {errors.documentType && (
                <p className="text-sm text-red-600">
                  {errors.documentType.message}
                </p>
              )}
            </div>

            {/* Document Number */}
            <div className="space-y-2">
              <label
                htmlFor="documentNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Número de Documento *
              </label>
              <input
                {...register("documentNumber")}
                id="documentNumber"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de documento"
              />
              {errors.documentNumber && (
                <p className="text-sm text-red-600">
                  {errors.documentNumber.message}
                </p>
              )}
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700"
              >
                Grado/Curso *
              </label>
              <select
                {...register("grade")}
                id="grade"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un grado</option>
                <option value="INICIAL I">INICIAL I</option>
                <option value="INICIAL II">INICIAL II</option>
                <option value="PREPARATORIA A">PREPARATORIA A</option>
                <option value="PREPARATORIA B">PREPARATORIA B</option>
                <option value="SEGUNDO A">SEGUNDO A</option>
                <option value="SEGUNDO B">SEGUNDO B</option>
                <option value="TERCERO A">TERCERO A</option>
                <option value="TERCERO B">TERCERO B</option>
                <option value="CUARTO A">CUARTO A</option>
                <option value="CUARTO B">CUARTO B</option>
                <option value="CUARTO C">CUARTO C</option>
                <option value="QUINTO A">QUINTO A</option>
                <option value="QUINTO B">QUINTO B</option>
                <option value="QUINTO C">QUINTO C</option>
                <option value="SEXTO A">SEXTO A</option>
                <option value="SEXTO B">SEXTO B</option>
                <option value="SEXTO C">SEXTO C</option>
                <option value="SÉPTIMO A">SÉPTIMO A</option>
                <option value="SÉPTIMO B">SÉPTIMO B</option>
                <option value="SÉPTIMO C">SÉPTIMO C</option>
                <option value="OCTAVO A">OCTAVO A</option>
                <option value="OCTAVO B">OCTAVO B</option>
                <option value="OCTAVO C">OCTAVO C</option>
                <option value="NOVENO A">NOVENO A</option>
                <option value="NOVENO B">NOVENO B</option>
                <option value="NOVENO C">NOVENO C</option>
                <option value="DÉCIMO A">DÉCIMO A</option>
                <option value="DÉCIMO B">DÉCIMO B</option>
                <option value="DÉCIMO C">DÉCIMO C</option>
                <option value="PRIMERO DE BACHILLERATO A">
                  PRIMERO DE BACHILLERATO A
                </option>
                <option value="PRIMERO DE BACHILLERATO B">
                  PRIMERO DE BACHILLERATO B
                </option>
                <option value="PRIMERO DE BACHILLERATO C">
                  PRIMERO DE BACHILLERATO C
                </option>
                <option value="SEGUNDO DE BACHILLERATO A">
                  SEGUNDO DE BACHILLERATO A
                </option>
                <option value="SEGUNDO DE BACHILLERATO B">
                  SEGUNDO DE BACHILLERATO B
                </option>
                <option value="SEGUNDO DE BACHILLERATO C">
                  SEGUNDO DE BACHILLERATO C
                </option>
                <option value="TERCERO DE BACHILLERATO A">
                  TERCERO DE BACHILLERATO A
                </option>
                <option value="TERCERO DE BACHILLERATO B">
                  TERCERO DE BACHILLERATO B
                </option>
                <option value="TERCERO DE BACHILLERATO C">
                  TERCERO DE BACHILLERATO C
                </option>
              </select>
              {errors.grade && (
                <p className="text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico *
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Phone numbers section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Información de Contacto
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Parent Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="parentPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono del Representante *
                </label>
                <input
                  {...register("parentPhone")}
                  id="parentPhone"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 0991234567"
                />
                {errors.parentPhone && (
                  <p className="text-sm text-red-600">
                    {errors.parentPhone.message}
                  </p>
                )}
              </div>

              {/* Secondary Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="secondaryPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono Secundario (Opcional)
                </label>
                <input
                  {...register("secondaryPhone")}
                  id="secondaryPhone"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 0991234567"
                />
                {errors.secondaryPhone && (
                  <p className="text-sm text-red-600">
                    {errors.secondaryPhone.message}
                  </p>
                )}
              </div>

              {/* House Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="housePhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono Convencional (Opcional)
                </label>
                <input
                  {...register("housePhone")}
                  id="housePhone"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 022123456"
                />
                {errors.housePhone && (
                  <p className="text-sm text-red-600">
                    {errors.housePhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4">
            <div className="space-y-2">
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Información Adicional (Opcional)
              </label>
              <textarea
                {...register("additionalInfo")}
                id="additionalInfo"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Información adicional relevante sobre el estudiante..."
              ></textarea>
            </div>
          </div>

          {/* New Student Checkbox */}
          <div className="pt-2">
            <div className="flex items-center">
              <input
                {...register("isNewStudent")}
                id="isNewStudent"
                type="checkbox"
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isNewStudent"
                className="ml-2 block text-sm text-gray-700"
              >
                Es estudiante nuevo
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
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
