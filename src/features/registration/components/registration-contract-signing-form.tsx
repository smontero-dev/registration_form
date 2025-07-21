"use client";

import { useRouter } from "next/navigation";
import { registrationSchema } from "../schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegistrationStore } from "@/app/registration/store";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import ContractTemplate from "@/components/contract-template";
import { PDFViewer, usePDF } from "@react-pdf/renderer";
import PdfViewer from "@/components/ui/pdf-viewer";

const registrationContractSigningSchema = registrationSchema.pick({
  signature_type: true,
});

type RegistrationContractSigningSchema = z.infer<
  typeof registrationContractSigningSchema
>;

export default function RegistrationContractSigningForm() {
  const router = useRouter();
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [pdfFile] = usePDF({ document: <ContractTemplate /> });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationContractSigningSchema>({
    resolver: zodResolver(registrationContractSigningSchema),
    defaultValues: {
      signature_type: null,
    },
    mode: "onBlur",
  });

  const signatureType = watch("signature_type");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setData, ...storedData } = useRegistrationStore.getState();

  useEffect(() => {
    if (!useRegistrationStore.persist.hasHydrated()) {
      return;
    }

    if (!storedData.email) {
      router.push("/registration/student-info");
    }
  }, [storedData, router]);

  const onPrevious = () => {
    router.push("/registration/billing-info");
  };

  const onSubmit = (data: RegistrationContractSigningSchema) => {
    const finalData = { ...storedData, ...data };
    console.log("Final Registration Data:", finalData);
  };

  const handleClearSignature = () => {
    signaturePadRef.current?.clear();
    setValue("signature_type", null, { shouldValidate: true });
    setSignature(null);
  };

  const handleEndSignature = () => {
    const signatureData = signaturePadRef.current
      ?.toDataURL("image/png")
      .trim();
    if (signatureData) {
      setSignature(signatureData);
      setValue("signature_type", "ONLINE_SIGNATURE", { shouldValidate: true });
    }
  };

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
              el recuadro de abajo para completar el registro. Al finalizar,
              podrá descargar el contrato con sus datos.
            </p>
          </div>

          {/* PDF Viewer Container */}
          {/* <div className="w-full rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[40rem] p-4"> */}
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
          <PDFViewer>
            <ContractTemplate />
          </PDFViewer>
          {/* </div> */}

          {/* Signature Pad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firme aquí:
            </label>
            <div className="border border-gray-300 rounded-md bg-white">
              <SignatureCanvas
                ref={signaturePadRef}
                penColor="black"
                canvasProps={{
                  className: "w-full h-48 rounded-md",
                }}
                onEnd={handleEndSignature}
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
