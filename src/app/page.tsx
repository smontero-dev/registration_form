"use client";

import AnimatedBus from "@/components/animated-bus";
import { checkAuthStatus, validateToken } from "@/services/authService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        const { authorized } = await checkAuthStatus()
          .catch((err) => {
            if (err.status === 403) {
              return { authorized: false };
            }
          })
          .then((res) => {
            return { authorized: res?.authorized ?? false };
          });
        if (authorized) {
          setIsAuthorized(true);
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await validateToken(token);
        if (response.authorized) {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error("Error validating token:", err);
        setError(
          "Token inválido o expirado. Por favor, ingrese directamente usando el QR o link proporcionado."
        );
      } finally {
        setIsLoading(false);
        router.replace("/", { scroll: false });
      }
    }

    if (!isAuthorized) {
      verifyToken();
    }
  }, [token, router, isAuthorized]);

  const renderButton = () => {
    if (isLoading) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500 animate-pulse">Verificando acceso...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center border border-red-200 bg-red-50 rounded-lg p-4">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      );
    }

    if (isAuthorized) {
      return (
        <Link
          href="/registration/student-info"
          className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-[#1e213a] hover:bg-[#2a2d4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e213a] transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Iniciar Registro de Estudiante
        </Link>
      );
    }

    return (
      <div className="text-center border border-yellow-200 bg-yellow-50 rounded-lg p-4">
        <p className="text-yellow-800">
          Para acceder al registro, por favor acceda escaneando el código QR.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header with same style as registration layout */}
        <div className="bg-[#1e213a] p-8 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sistema de Registro
          </h1>
          <p className="text-gray-300 text-base mt-2">Año Lectivo 2025-2026</p>
        </div>

        <div className="p-8 space-y-7">
          {/* Logo */}
          <div className="flex justify-center -mt-2">
            <AnimatedBus />
          </div>

          {/* Welcome Text */}
          <div className="text-center">
            <p className="text-gray-700 text-lg">
              Bienvenido al registro de servicio de transporte escolar para
              estudiantes de la U.E. Bilingüe La Inmaculada
            </p>
          </div>

          {/* Registration Button - styled to match the header */}
          <div>{renderButton()}</div>

          {/* Additional Info */}
          <div className="text-sm text-center text-gray-600 border-t border-gray-200 pt-5 mt-4">
            <p>
              Para consultas o asistencia, contactar con la{" "}
              <a
                href="mailto:soporte@transporte-escolar.com"
                className="text-[#1e213a] font-medium hover:text-[#2a2d4a] underline decoration-2 underline-offset-2 transition-colors"
              >
                oficina de transporte escolar
              </a>
              .
            </p>
            <p className="mt-2 text-gray-500">
              © {new Date().getFullYear()} Santiago Montero. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
