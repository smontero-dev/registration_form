"use client";

import { checkAuthStatus, validateToken } from "@/services/authService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function RegistrationContentGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        if (token) {
          const response = await validateToken(token);
          if (response.authorized) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("token");
            const cleanUrl = newParams.toString()
              ? `${pathname}?${newParams.toString()}`
              : pathname;
            router.replace(cleanUrl, { scroll: false });
            setIsVerifying(false);
            return;
          }
        }

        const { authorized } = await checkAuthStatus();
        if (!authorized) {
          router.replace("/");
          return;
        }
        setIsVerifying(false);
      } catch (err) {
        console.error("Error checking auth status:", err);
        router.replace("/");
      }
    };

    verifyAccess();
  }, [router, pathname, searchParams, token]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
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

          {/* Form */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RegistrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 animate-pulse">Verificando acceso...</p>
        </div>
      }
    >
      <RegistrationContentGuard>{children}</RegistrationContentGuard>
    </Suspense>
  );
}

