"use client";

import { useRegistrationStore } from "@/app/registration/store";
import Link from "next/link";
import { useEffect } from "react";

export default function OfficeRedirectPage() {
  useEffect(() => {
    // Clear registration storage once redirect notice is presented
    useRegistrationStore.persist.clearStorage();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Formulario de Registro Guardado Exitosamente
      </h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-md text-left space-y-3">
        <p className="text-sm text-blue-800 font-medium">
          Información Importante sobre su Contrato:
        </p>
        <p className="text-sm text-blue-700 leading-relaxed">
          Para estudiantes nuevos o registros que requieren asignación o verificación
          tarifaria, la firma del contrato de transporte debe realizarse directamente en la{" "}
          <span className="font-semibold">Oficina de Transporte Escolar</span>.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left space-y-3 text-sm text-gray-700">
        <h3 className="font-semibold text-gray-800 text-base">
          Detalles de Contacto y Atención:
        </h3>
        <p>
          <span className="font-medium text-gray-900">Ubicación:</span> Unidad
          Educativa Bilingüe La Inmaculada - Oficina de Transporte
        </p>
        <p>
          <span className="font-medium text-gray-900">Correo de Atención:</span>{" "}
          <a
            href="mailto:transporteinmaculada2@gmail.com"
            className="text-blue-600 underline font-medium"
          >
            transporteinmaculada2@gmail.com
          </a>
        </p>
        <p>
          <span className="font-medium text-gray-900">Horario:</span> Lunes a Viernes,
          07:30 - 14:00
        </p>
      </div>

      <div className="pt-4">
        <a
          href="/"
          className="inline-block px-8 py-3 bg-[#1e213a] text-white font-medium rounded-lg hover:bg-[#2a2d4a] transition-all"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}
