import { z } from "zod";

export const registrationSchema = z.object({
  email: z.email("Ingrese un email válido."),
  studentName: z.string().nonempty("Este es un campo requerido."),
  studentSurname: z.string().nonempty("Este es un campo requerido."),
  documentType: z.enum(["CÉDULA", "PASAPORTE", "OTRO"], {
    error: "Seleccione un tipo de documento válido.",
  }),
  documentNumber: z.string().nonempty("Este es un campo requerido."),
  grade: z.enum(
    [
      "INICIAL I",
      "INICIAL II",
      "PREPARATORIA A",
      "PREPARATORIA B",
      "SEGUNDO A",
      "SEGUNDO B",
      "TERCERO A",
      "TERCERO B",
      "CUARTO A",
      "CUARTO B",
      "CUARTO C",
      "QUINTO A",
      "QUINTO B",
      "QUINTO C",
      "SEXTO A",
      "SEXTO B",
      "SEXTO C",
      "SÉPTIMO A",
      "SÉPTIMO B",
      "SÉPTIMO C",
      "OCTAVO A",
      "OCTAVO B",
      "OCTAVO C",
      "NOVENO A",
      "NOVENO B",
      "NOVENO C",
      "DÉCIMO A",
      "DÉCIMO B",
      "DÉCIMO C",
      "PRIMERO DE BACHILLERATO A",
      "PRIMERO DE BACHILLERATO B",
      "PRIMERO DE BACHILLERATO C",
      "SEGUNDO DE BACHILLERATO A",
      "SEGUNDO DE BACHILLERATO B",
      "SEGUNDO DE BACHILLERATO C",
      "TERCERO DE BACHILLERATO A",
      "TERCERO DE BACHILLERATO B",
      "TERCERO DE BACHILLERATO C",
    ],
    {
      error: "Seleccione un grado válido.",
    }
  ),
  parentPhone: z
    .string()
    .nonempty("Este es un campo requerido.")
    .regex(/^\d+$/, "El número de teléfono debe contener solo dígitos."),
  secondaryPhone: z
    .string()
    .refine(
      (value) => value === "" || /^\d+$/.test(value),
      "El número de teléfono debe contener solo dígitos."
    )
    .optional(),
  housePhone: z
    .string()
    .refine(
      (value) => value === "" || /^\d+$/.test(value),
      "El número de teléfono debe contener solo dígitos."
    )
    .optional(),
  additionalInfo: z.string().optional(),
  isNewStudent: z.boolean().optional(),
  location: z
    .object({
      morning: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
      afternoon: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
    })
    .refine((data) => data.morning || data.afternoon, {
      message: "Debe seleccionar al menos una ubicación (Mañana o Tarde).",
    }),

  billingInfo: z.object({
    name: z.string().nonempty("Este es un campo requerido."),
    surname: z.string().nonempty("Este es un campo requerido."),
    documentType: z.enum(["CÉDULA", "PASAPORTE", "OTRO"], {
      error: "Seleccione un tipo de documento válido.",
    }),
    documentNumber: z.string().nonempty("Este es un campo requerido."),
    address: z.string().nonempty("Este es un campo requerido."),
    phone: z
      .string()
      .nonempty("Este es un campo requerido.")
      .regex(/^\d+$/, "El número de teléfono debe contener solo dígitos."),
    email: z.email("Ingrese un email válido."),
  }),

  signature_type: z
    .enum(["ONLINE_SIGNATURE", "TO_BE_SIGNED_IN_PERSON"], {
      error:
        "Por favor, firme el contrato o seleccione la opción 'Firmar en oficina'.",
    })
    .nullable()
    .nonoptional(),
});

export type RegistrationSchema = z.infer<typeof registrationSchema>;
