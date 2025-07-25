"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useCallback, useEffect, useRef, useState } from "react";
import ContractTemplate from "@/components/contract-template";
import { usePDF } from "@react-pdf/renderer";
import PdfViewer from "@/components/ui/pdf-viewer";
import SignaturePad from "react-signature-pad-wrapper";

const registrationContractSigningSchema = registrationSchema.pick({
  price: true,
  signature_type: true,
});

type RegistrationContractSigningSchema = z.infer<
  typeof registrationContractSigningSchema
>;

export default function RegistrationContractSigningForm() {
  const router = useRouter();
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [signature, setSignature] = useState<string | undefined>(undefined);

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<RegistrationContractSigningSchema>({
    resolver: zodResolver(registrationContractSigningSchema),
    defaultValues: {
      signature_type: null,
    },
    mode: "onBlur",
  });

  const signatureType = watch("signature_type");
  const price = watch("price");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setData, ...storedData } = useRegistrationStore.getState();

  const checkAndRedirect = useCallback(() => {
    const storedData = useRegistrationStore.getState();

    if (!storedData.email) {
      router.push("/registration/student-info");
    } else if (!storedData.location) {
      router.push("/registration/route-stops");
    } else if (!storedData.billingInfo) {
      router.push("/registration/billing-info");
    }
  }, [router]);

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated()) {
      const unsubscribe = useRegistrationStore.persist.onHydrate(() => {
        checkAndRedirect();
      });

      return unsubscribe;
    }

    checkAndRedirect();
  }, [checkAndRedirect]);

  const onPrevious = () => {
    router.push("/registration/billing-info");
  };

  const onSubmit = (data: RegistrationContractSigningSchema) => {
    const finalData = { ...storedData, ...data };
    console.log("Final Registration Data:", finalData);
  };

  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setValue("signature_type", null, { shouldValidate: true });
      setSignature(undefined);
    }
  };

  const handleEndSignature = useCallback(() => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current
        .toDataURL("image/png")
        .trim();
      if (signatureData) {
        setSignature(signatureData);
        setValue("signature_type", "ONLINE_SIGNATURE", {
          shouldValidate: true,
        });
      }
    }
  }, [setValue]);

  // Set up signature pad event listener
  useEffect(() => {
    const signaturePad = signaturePadRef.current;
    if (signaturePad && signaturePad.instance) {
      signaturePad.instance.addEventListener("endStroke", handleEndSignature);

      // Clean up event listener when component unmounts
      return () => {
        if (signaturePad.instance) {
          signaturePad.instance.removeEventListener(
            "endStroke",
            handleEndSignature
          );
        }
      };
    }
  }, [handleEndSignature]);

  const [pdfFile] = usePDF({
    document: (
      <ContractTemplate
        studentName={storedData.studentName}
        studentSurname={storedData.studentSurname}
        documentNumber={storedData.documentNumber}
        signature={signature}
        parentName={storedData.billingInfo?.name}
        parentDocumentNumber={storedData.billingInfo?.documentNumber}
        monthlyCost={price}
      />
    ),
  });

  return (
    <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Firma del Contrato
            </h3>
            <p className="text-gray-600 mb-6">
              Por favor, revise el contrato de transporte escolar y fírmelo en
              el recuadro de abajo para completar el registro.
            </p>
          </div>

          {storedData.isNewStudent && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 font-medium">
                    Nota importante
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Después de firmar y enviar este formulario, si usted es
                    estudiante nuevo, deberá acercarse personalmente a la
                    oficina de transporte para verificar y confirmar el valor
                    final del servicio. Este paso es obligatorio para completar
                    su proceso de registro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contract Preview Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-10">
            <div className="text-center ">
              <h4 className="text-base font-semibold text-gray-800 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-blue-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                Vista Previa del Contrato
              </h4>
              <p className="text-sm text-gray-600">
                Este es un documento preliminar. Después de firmar y enviar,
                podrá descargar el contrato final con sus datos.
              </p>
            </div>
          </div>

          {/* PDF Viewer */}
          {pdfFile.loading && (
            <div className="text-center">
              <p className="text-gray-500">Cargando contrato...</p>
            </div>
          )}
          {pdfFile.error && (
            <div className="text-center text-red-600">
              <p className="font-semibold">Error al cargar el contrato</p>
              <p className="text-sm">{pdfFile.error}</p>
            </div>
          )}
          {pdfFile.url && <PdfViewer file={pdfFile.url} />}

          {/* Price Input Field */}
          {storedData && !storedData.isNewStudent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio del Servicio de Transporte *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  {...register("price", {
                    valueAsNumber: true,
                  })}
                  className={`block w-full pl-7 pr-20 py-2 border ${
                    errors.price
                      ? "border-red-300 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-md bg-white focus:outline-none focus:ring-2 ${
                    errors.price
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="0.00"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">USD/mes</span>
                </div>
              </div>
              {errors.price ? (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price.message || "Por favor ingrese un valor válido"}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Ingrese el precio acordado para los servicios de transporte.
                </p>
              )}
            </div>
          )}

          {/* Signature Pad */}
          {/* {signature && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Su firma:
              </label>
              <div className="w-full h-48 relative border-2 border-green-500 rounded-md">
                <Image
                  src={signature}
                  alt="Firma"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          )} */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firme aquí (usar mouse o dedo):
            </label>
            <div className="border border-gray-300 rounded-md bg-white">
              <SignaturePad
                ref={signaturePadRef}
                options={{
                  penColor: "black",
                  backgroundColor: "rgb(255, 255, 255)",
                }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleClearSignature}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpiar Firma
              </button>
            </div>
            {errors.signature_type && (
              <p className="text-sm text-red-600 mt-1">
                {errors.signature_type.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
        >
          ← Anterior
        </button>
        {/* {signatureType && (
          <PDFDownloadLink
            document={<ContractTemplate />}
            fileName="contrato.pdf"
            className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={handleSubmit(onSubmit)}
          >
            {({ loading }) =>
              loading
                ? "Generando PDF..."
                : "Enviar Registro y Descargar Contrato"
            }
          </PDFDownloadLink>
        )} */}
        <button
          type="submit"
          disabled={!signatureType}
          className={`px-8 py-3 rounded-md ${
            signatureType
              ? "bg-green-600 text-white hover:bg-green-700 transition font-bold"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition font-bold`}
        >
          Enviar Registro
        </button>
      </div>
    </form>
  );
}
