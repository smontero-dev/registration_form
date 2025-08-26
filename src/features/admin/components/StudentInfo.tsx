"use client";

import { RouteAttr, Student } from "@/types";
import { titleCase } from "title-case";

type StudentInfoProps = {
  student: Student;
  onCloseModal: () => void;
};

export default function StudentInfo({
  student,
  onCloseModal,
}: StudentInfoProps) {
  const closeModal = () => onCloseModal();

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1000] p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8"
        onClick={stopPropagation}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {titleCase(student.studentName.trim().toLowerCase())}{" "}
            {titleCase(student.studentSurname.trim().toLowerCase())}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800 transition-colors text-2xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Route Info */}
        <div className="mb-8">
          <InfoSection title="Información de Ubicación y Rutas">
            <div
              className={
                student.location.morning.lat && student.location.afternoon.lat
                  ? "grid grid-cols-1 md:grid-cols-2 gap-8"
                  : "flex justify-center"
              }
            >
              {student.location.morning.lat && (
                <div>
                  <h4 className="font-semibold text-lg text-gray-700 mb-2">
                    Ubicación de Mañana
                  </h4>
                  <RouteAssignmentStatus
                    assignedRoute={student.routes?.find(
                      (route) => route.period === "morning"
                    )}
                  />
                  <AddressInfo address={student.streetInfo.morning} />
                </div>
              )}
              {student.location.afternoon.lat && (
                <div>
                  <h4 className="font-semibold text-lg text-gray-700 mb-2">
                    Ubicación de Tarde
                  </h4>
                  <RouteAssignmentStatus
                    assignedRoute={student.routes?.find(
                      (route) => route.period === "afternoon"
                    )}
                  />
                  <AddressInfo address={student.streetInfo.afternoon} />
                </div>
              )}
            </div>
          </InfoSection>
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
              <InfoItem label="Dirección" value={student.billingInfo.address} />
            </InfoSection>
          </div>
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
            className="px-6 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-50/70 rounded-lg p-5">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-12 gap-2 text-sm py-2 border-b border-gray-200/60 last:border-b-0">
    <p className="col-span-5 text-gray-500">{label}</p>
    <p className="col-span-7 text-gray-900 font-medium text-right">{value}</p>
  </div>
);

const AddressInfo = ({
  address,
}: {
  address: {
    mainStreet: string;
    secondaryStreet?: string;
    neighborhood: string;
    referencePoints?: string;
  };
}) => (
  <div className="text-sm mt-2">
    <InfoItem label="Calle Principal" value={address.mainStreet} />
    <InfoItem label="Calle Secundaria" value={address.secondaryStreet ?? ""} />
    <InfoItem label="Barrio" value={address.neighborhood} />
    <InfoItem label="Referencia" value={address.referencePoints ?? ""} />
  </div>
);

const RouteAssignmentStatus = ({
  assignedRoute,
}: {
  assignedRoute: RouteAttr | undefined;
}) => (
  <div
    className={`p-3 rounded-lg text-center mb-3 text-sm font-bold ${
      assignedRoute
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {/* {(assignedRoute && assignedRoute !== "") ? assignedRoute.toUpperCase() : "SIN RUTA ASIGNADA"} */}
    {assignedRoute?.name.toUpperCase() ?? "SIN RUTA ASIGNADA"}
  </div>
);
