"use client";

import dynamic from "next/dynamic";

const RegistrationContractSigningForm = dynamic(
  () =>
    import(
      "@/features/registration/components/registration-contract-signing-form"
    ),
  { ssr: false }
);

export default function ContractSigningPage() {
  return <RegistrationContractSigningForm />;
}
