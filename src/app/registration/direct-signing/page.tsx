"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

const RegistrationDirectSigningForm = dynamic(
  () =>
    import(
      "@/features/registration/components/registration-direct-signing-form"
    ),
  { ssr: false }
);

function DirectSigningContent() {
  const searchParams = useSearchParams();
  const doc = searchParams.get("doc");
  const schoolYear = searchParams.get("schoolYear");

  if (!doc || !schoolYear) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-md text-left shadow-sm">
          <h3 className="text-lg font-bold text-amber-800 mb-2">
            Enlace Incompleto o Inválido
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            Para realizar la firma directa del contrato, debe proporcionar un
            enlace válido con el número de documento y año lectivo proporcionado
            por la Oficina de Transporte Escolar.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#1e213a] text-white font-medium rounded-lg hover:bg-[#2a2d4a] transition-all shadow-sm"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return <RegistrationDirectSigningForm doc={doc} schoolYear={schoolYear} />;
}

export default function DirectSigningPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 animate-pulse">
          Cargando parámetros de firma...
        </div>
      }
    >
      <DirectSigningContent />
    </Suspense>
  );
}
