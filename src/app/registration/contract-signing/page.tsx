"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const RegistrationContractSigningForm = dynamic(
  () =>
    import(
      "@/features/registration/components/registration-contract-signing-form"
    ),
  { ssr: false }
);

function ContractSigningContent() {
  const searchParams = useSearchParams();
  const doc = searchParams.get("doc");
  const schoolYear = searchParams.get("schoolYear");

  return <RegistrationContractSigningForm doc={doc} schoolYear={schoolYear} />;
}

export default function ContractSigningPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 animate-pulse">
          Cargando formulario de firma...
        </div>
      }
    >
      <ContractSigningContent />
    </Suspense>
  );
}
