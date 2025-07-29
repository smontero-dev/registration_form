"use client";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  downloading: boolean;
}

export default function SuccessModal({
  isOpen,
  onClose,
  onDownload,
  downloading,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            ¡Registro Exitoso!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Su registro ha sido completado exitosamente. Puede descargar el
              contrato firmado o volver a la página de inicio.
            </p>
          </div>
          <div className="items-center px-4 py-3 space-y-2">
            <button
              id="download-button"
              onClick={onDownload}
              disabled={downloading}
              className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300"
            >
              {downloading ? "Descargando..." : "Descargar Contrato"}
            </button>
            <button
              id="close-button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Volver a Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
