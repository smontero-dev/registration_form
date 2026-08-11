"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { fetchRegistrationForSigning, uploadContract } from "@/services/registrationService";
import { Student } from "@/types";
import { isFinalYearGrade } from "@/features/registration/utils/contractUtils";
import FinalYearContractTemplate from "@/components/final-year-contract-template";
import ContractTemplate from "@/components/contract-template";
import { pdf, usePDF } from "@react-pdf/renderer";
import PdfViewer from "@/components/ui/pdf-viewer";
import SignaturePad from "react-signature-pad-wrapper";
import SuccessModal from "@/components/ui/SuccessModal";
import axios from "axios";

interface RegistrationDirectSigningFormProps {
  doc: string;
  schoolYear: string;
}

export default function RegistrationDirectSigningForm({
  doc,
  schoolYear,
}: RegistrationDirectSigningFormProps) {
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [filename, setFilename] = useState("");
  const [signedContract, setSignedContract] = useState<Blob | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadRegistrationData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await fetchRegistrationForSigning(doc, schoolYear);
        if (isMounted) {
          setStudent(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching registration data for signing:", err);
          setFetchError(
            "No se encontró el registro especificado o la información no está disponible. Por favor, verifique los datos o solicite un nuevo enlace a la Oficina de Transporte."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (doc && schoolYear) {
      loadRegistrationData();
    }

    return () => {
      isMounted = false;
    };
  }, [doc, schoolYear]);

  const isFinalYear = isFinalYearGrade(student?.grade);
  const SelectedContractTemplate = isFinalYear
    ? FinalYearContractTemplate
    : ContractTemplate;

  const [contractPDF] = usePDF({
    document: student ? (
      <SelectedContractTemplate
        name={student.name}
        surname={student.surname}
        documentNumber={student.documentNumber}
        parentName={student.billingInfo?.name}
        parentSurname={student.billingInfo?.surname}
        parentDocumentNumber={student.billingInfo?.documentNumber}
        monthlyCost={Number(student.price || 0)}
      />
    ) : null,
  });

  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignature(undefined);
      setSignatureError(null);
    }
  };

  const handleEndSignature = useCallback(() => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current
        .toDataURL("image/png")
        .trim();
      if (signatureData) {
        setSignature(signatureData);
        setSignatureError(null);
      }
    }
  }, []);

  useEffect(() => {
    const signaturePad = signaturePadRef.current;
    if (signaturePad && signaturePad.instance) {
      signaturePad.instance.addEventListener("endStroke", handleEndSignature);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) {
      setSignatureError("Por favor, realice su firma en el recuadro antes de enviar.");
      return;
    }

    if (!student) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const signedContractPDF = (
        <SelectedContractTemplate
          name={student.name}
          surname={student.surname}
          documentNumber={student.documentNumber}
          parentName={student.billingInfo?.name}
          parentSurname={student.billingInfo?.surname}
          parentDocumentNumber={student.billingInfo?.documentNumber}
          monthlyCost={Number(student.price || 0)}
          signature={signature}
        />
      );

      const contractBlob = await pdf(signedContractPDF).toBlob();
      if (!contractBlob) {
        throw new Error("Error generating PDF");
      }

      setSignedContract(contractBlob);
      const generatedFilename = `${(student.surname || "").replaceAll(
        " ",
        "_"
      )}_${(student.name || "").replaceAll(" ", "_")}_Contrato.pdf`;
      setFilename(generatedFilename);

      await uploadContract(doc, schoolYear, contractBlob);
      setIsModalOpen(true);
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
          "Ocurrió un error inesperado al procesar la firma del contrato. Por favor, intente nuevamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (downloadFilename: string) => {
    if (signedContract) {
      setIsDownloading(true);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(signedContract);
      a.download = downloadFilename;
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

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 animate-pulse text-lg">
          Cargando datos del registro para firma...
        </p>
      </div>
    );
  }

  if (fetchError || !student) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-md text-left shadow-sm">
          <h3 className="text-lg font-bold text-red-800 mb-2">
            Error de Registro
          </h3>
          <p className="text-sm text-red-700 leading-relaxed">
            {fetchError || "No se pudo cargar la información del estudiante."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="p-6" onSubmit={onSubmit}>
        <div className="mb-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Firma de Contrato Asignado
              </h3>
              <p className="text-gray-600 mb-4">
                Estudiante:{" "}
                <span className="font-semibold text-gray-900">
                  {student.name} {student.surname}
                </span>{" "}
                ({student.grade})
              </p>
              <p className="text-gray-600 text-sm">
                Por favor, revise el contrato de transporte escolar y fírmelo en
                el recuadro de abajo para completar la formalización.
              </p>
            </div>

            {/* Contract Preview Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
              <div className="text-center">
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
                  Documento asignado por la Oficina de Transporte Escolar.
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
                  Valor mensual fijado para el periodo {schoolYear}
                </span>
              </div>
              <div className="bg-blue-600 text-white font-bold text-lg px-4 py-2 rounded-md shadow-sm whitespace-nowrap">
                ${Number(student.price || 0).toFixed(2)} USD/mes
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
              {signatureError && (
                <p className="text-sm text-red-600 mt-1">{signatureError}</p>
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!signature || isSubmitting}
            className={`px-8 py-3 rounded-md ${
              signature && !isSubmitting
                ? "bg-green-600 text-white hover:bg-green-700 font-bold shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed font-bold"
            } transition`}
          >
            {isSubmitting ? "Enviando Firma..." : "Completar y Firmar Contrato"}
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
