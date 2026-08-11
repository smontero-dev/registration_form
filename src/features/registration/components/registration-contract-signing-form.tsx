"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { isFinalYearGrade } from "@/features/registration/utils/contractUtils";
import FinalYearContractTemplate from "@/components/final-year-contract-template";
import ContractTemplate from "@/components/contract-template";
import { pdf, usePDF } from "@react-pdf/renderer";
import PdfViewer from "@/components/ui/pdf-viewer";
import SignaturePad from "react-signature-pad-wrapper";
import { uploadContract } from "@/services/registrationService";
import SuccessModal from "@/components/ui/SuccessModal";
import axios from "axios";

const registrationContractSigningSchema = registrationSchema.pick({
  signatureType: true,
});

type RegistrationContractSigningSchema = z.infer<
  typeof registrationContractSigningSchema
>;

export default function RegistrationContractSigningForm() {
  const router = useRouter();
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [filename, setFilename] = useState("");
  const [signedContract, setSignedContract] = useState<Blob | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrationContractSigningSchema>({
    resolver: zodResolver(registrationContractSigningSchema),
    defaultValues: {
      signatureType: null,
    },
    mode: "onBlur",
  });

  const signatureType = watch("signatureType");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setData, ...storedData } = useRegistrationStore.getState();
  const isFinalYear = isFinalYearGrade(storedData.grade);
  const SelectedContractTemplate = isFinalYear
    ? FinalYearContractTemplate
    : ContractTemplate;

  const [contractPDF] = usePDF({
    document: (
      <SelectedContractTemplate
        name={storedData.name}
        surname={storedData.surname}
        documentNumber={storedData.documentNumber}
        parentName={storedData.billingInfo?.name}
        parentSurname={storedData.billingInfo?.surname}
        parentDocumentNumber={storedData.billingInfo?.documentNumber}
        monthlyCost={storedData.price}
      />
    ),
  });

  const checkAndRedirect = useCallback(() => {
    const storedData = useRegistrationStore.getState();

    if (!storedData.email) {
      router.push("/registration/student-info");
    } else if (!storedData.locations) {
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

  const onSubmit = async () => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const documentNumber =
        storedData.documentNumber ||
        storedData.billingInfo?.documentNumber ||
        "";
      const schoolYear = storedData.schoolYear || "2025-2026";

      if (!documentNumber) {
        throw new Error("No document number found for registration.");
      }

      const signedContractPDF = (
        <SelectedContractTemplate
          name={storedData.name}
          surname={storedData.surname}
          documentNumber={storedData.documentNumber}
          parentName={storedData.billingInfo?.name}
          parentSurname={storedData.billingInfo?.surname}
          parentDocumentNumber={storedData.billingInfo?.documentNumber}
          monthlyCost={storedData.price}
          signature={signature}
        />
      );

      const contractBlob = await pdf(signedContractPDF).toBlob();
      if (!contractBlob) {
        throw new Error("Error generating PDF");
      }

      setSignedContract(contractBlob);
      const generatedFilename = `${(storedData.surname || "").replaceAll(
        " ",
        "_"
      )}_${(storedData.name || "").replaceAll(" ", "_")}_Contrato.pdf`;
      setFilename(generatedFilename);
      await uploadContract(documentNumber, schoolYear, contractBlob);
      setIsModalOpen(true);
      useRegistrationStore.persist.clearStorage();
      reset();
    } catch (error) {
      console.error("Error during contract upload process:", error);
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const serverMessage =
          typeof responseData === "string"
            ? responseData
            : responseData?.message || responseData?.error || "";

        if (error.response) {
          setApiError(
            serverMessage ||
              "No se pudo completar la carga del contrato debido a un problema en el servidor. Por favor, intente nuevamente."
          );
        } else {
          setApiError(
            "No fue posible conectar con el servidor. Por favor, verifique su conexión a internet e intente nuevamente."
          );
        }
      } else {
        setApiError(
          "Ocurrió un error inesperado en la aplicación. Por favor, intente nuevamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setValue("signatureType", null, { shouldValidate: true });
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
        setValue("signatureType", "ONLINE_SIGNATURE", {
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

  const handleDownload = (filename: string) => {
    if (signedContract) {
      setIsDownloading(true);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(signedContract);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      setIsDownloading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.href = "/";
  };

  return (
    <>
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
                      final del servicio. Este paso es obligatorio para
                      completar su proceso de registro.
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
            {contractPDF.loading && (
              <div className="text-center">
                <p className="text-gray-500">Cargando contrato...</p>
              </div>
            )}
            {contractPDF.error && (
              <div className="text-center text-red-600">
                <p className="font-semibold">Error al cargar el contrato</p>
                <p className="text-sm">{contractPDF.error}</p>
              </div>
            )}
            {contractPDF.url && <PdfViewer file={contractPDF.url} />}

            {/* Read-Only Price Summary Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Tarifa del Servicio Asignada
                </span>
                <span className="text-sm text-blue-900 font-medium">
                  Valor mensual acordado para el servicio de transporte
                </span>
              </div>
              <div className="bg-blue-600 text-white font-bold text-lg px-4 py-2 rounded-md shadow-sm whitespace-nowrap">
                ${Number(storedData.price || 0).toFixed(2)} USD/mes
              </div>
            </div>

            {/* Signature Pad */}
            <div>
              <label className="flex items-center text-base font-semibold text-gray-800 mb-2">
                <svg
                  className="h-5 w-5 text-blue-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
                Firme aquí (usar mouse o dedo):
              </label>
              <div className="border-2 border-blue-200 rounded-md bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
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
              {errors.signatureType && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.signatureType.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{apiError}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
          >
            ← Anterior
          </button>
          <button
            type="submit"
            disabled={!signatureType || isSubmitting}
            className={`px-8 py-3 rounded-md ${
              signatureType && !isSubmitting
                ? "bg-green-600 text-white hover:bg-green-700 transition font-bold"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition font-bold`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Registro"}
          </button>
        </div>
      </form>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={() => handleDownload(filename)}
        downloading={isDownloading}
      />
    </>
  );
}
