"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function DirectSigningRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const doc = searchParams.get("doc");
    const schoolYear = searchParams.get("schoolYear");
    if (doc && schoolYear) {
      router.replace(
        `/registration/contract-signing?doc=${encodeURIComponent(
          doc
        )}&schoolYear=${encodeURIComponent(schoolYear)}`
      );
    } else {
      router.replace("/registration/contract-signing");
    }
  }, [router, searchParams]);

  return (
    <div className="p-8 text-center text-gray-500 animate-pulse">
      Redirigiendo a firma de contrato...
    </div>
  );
}

export default function DirectSigningPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500 animate-pulse">
          Cargando...
        </div>
      }
    >
      <DirectSigningRedirectContent />
    </Suspense>
  );
}
