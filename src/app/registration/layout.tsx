"use client";

import { checkAuthStatus } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const { authorized } = await checkAuthStatus();
        // const authorized = true; // Force authorization for testing
        if (!authorized) {
          router.replace("/");
        }
        setIsVerifying(false);
      } catch (err) {
        console.error("Error checking auth status:", err);
        router.replace("/");
      }
    };

    verifyAccess();
  }, [router]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-[#1e213a] p-6">
        <h1 className="text-3xl font-bold text-white">
          Registro de Estudiante
        </h1>
        <p className="mt-2 text-gray-300">
          Por favor complete toda la información requerida para el registro de
          transporte escolar
        </p>
      </div>

      {/* Progress indicator */}
      {/* <FormProgress steps={steps} currentStep={currentStep} /> */}

      {/* Form */}
      {children}
    </div>
  );
}
