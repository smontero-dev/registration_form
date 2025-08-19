"use client";

import { useState } from "react";
import { Student } from "@/types";

type StudentInfoProps = {
  student: Student;
};

export default function StudentInfo({ student }: StudentInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        onClick={openModal}
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <p className="font-semibold text-lg text-gray-800">
          {student.studentName} {student.studentSurname}
        </p>
        <p className="text-sm text-gray-600">{student.grade}</p>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8"
            onClick={stopPropagation}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {student.studentName} {student.studentSurname}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Student & Contact Info */}
              <div className="space-y-6">
                <InfoSection title="Información del Estudiante">
                  <InfoItem label="Grado" value={student.grade} />
                  <InfoItem
                    label="Documento"
                    value={`${student.documentType} ${student.documentNumber}`}
                  />
                  <InfoItem label="Email" value={student.email} />
                  <InfoItem
                    label="Estudiante Nuevo"
                    value={student.isNewStudent ? "Sí" : "No"}
                  />
                </InfoSection>

                <InfoSection title="Información de Contacto">
                  <InfoItem
                    label="Teléfono Principal"
                    value={student.parentPhone}
                  />
                  {student.secondaryPhone && (
                    <InfoItem
                      label="Teléfono Secundario"
                      value={student.secondaryPhone}
                    />
                  )}
                  {student.housePhone && (
                    <InfoItem
                      label="Teléfono Convencional"
                      value={student.housePhone}
                    />
                  )}
                </InfoSection>
              </div>

              {/* Billing Info */}
              <div className="space-y-6">
                <InfoSection title="Información de Facturación">
                  <InfoItem
                    label="Nombre"
                    value={`${student.billingInfo.name} ${student.billingInfo.surname}`}
                  />
                  <InfoItem
                    label="Documento"
                    value={`${student.billingInfo.documentType} ${student.billingInfo.documentNumber}`}
                  />
                  <InfoItem label="Email" value={student.billingInfo.email} />
                  <InfoItem label="Teléfono" value={student.billingInfo.phone} />
                  <InfoItem
                    label="Dirección"
                    value={student.billingInfo.address}
                  />
                </InfoSection>
              </div>
            </div>

            {/* Route Info */}
            <div className="mt-8">
              <InfoSection title="Información de la Ruta">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">
                      Ruta de Mañana
                    </h4>
                    <AddressInfo address={student.streetInfo.morning} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">
                      Ruta de Tarde
                    </h4>
                    <AddressInfo address={student.streetInfo.afternoon} />
                  </div>
                </div>
              </InfoSection>
            </div>

            {/* Additional Info */}
            {student.additionalInfo && (
              <div className="mt-8">
                <InfoSection title="Información Adicional">
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                    {student.additionalInfo}
                  </p>
                </InfoSection>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-4 border border-gray-200 rounded-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <p className="font-medium text-gray-600">{label}:</p>
    <p className="text-gray-800 text-right">{value}</p>
  </div>
);

const AddressInfo = ({
  address,
}: {
  address: {
    mainStreet: string;
    secondaryStreet: string;
    neighborhood: string;
    referencePoints: string;
  };
}) => (
  <div className="space-y-2 text-sm">
    <InfoItem label="Calle Principal" value={address.mainStreet} />
    <InfoItem label="Calle Secundaria" value={address.secondaryStreet} />
    <InfoItem label="Barrio" value={address.neighborhood} />
    <InfoItem label="Referencia" value={address.referencePoints} />
  </div>
);
