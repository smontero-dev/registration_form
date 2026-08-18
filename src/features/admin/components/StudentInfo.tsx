"use client";

import { LocationDetail, RouteAttr, Student } from "@/types";
import { titleCase } from "title-case";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "@/services/studentService";
import dynamic from "next/dynamic";
import {
  Copy,
  Check,
  Edit2,
  X,
  Save,
  AlertTriangle,
  MapPin,
  FileText,
  DollarSign,
  User,
  Phone,
  Home,
  ShieldAlert,
} from "lucide-react";

const GRADES = [
  "INICIAL I",
  "INICIAL II",
  "PREPARATORIA A",
  "PREPARATORIA B",
  "SEGUNDO A",
  "SEGUNDO B",
  "TERCERO A",
  "TERCERO B",
  "CUARTO A",
  "CUARTO B",
  "CUARTO C",
  "QUINTO A",
  "QUINTO B",
  "QUINTO C",
  "SEXTO A",
  "SEXTO B",
  "SEXTO C",
  "SÉPTIMO A",
  "SÉPTIMO B",
  "SÉPTIMO C",
  "OCTAVO A",
  "OCTAVO B",
  "OCTAVO C",
  "NOVENO A",
  "NOVENO B",
  "NOVENO C",
  "DÉCIMO A",
  "DÉCIMO B",
  "DÉCIMO C",
  "PRIMERO DE BACHILLERATO A",
  "PRIMERO DE BACHILLERATO B",
  "PRIMERO DE BACHILLERATO C",
  "SEGUNDO DE BACHILLERATO A",
  "SEGUNDO DE BACHILLERATO B",
  "SEGUNDO DE BACHILLERATO C",
  "TERCERO DE BACHILLERATO A",
  "TERCERO DE BACHILLERATO B",
  "TERCERO DE BACHILLERATO C",
];

const DOCUMENT_TYPES = ["CÉDULA", "PASAPORTE", "OTRO"];

type EditFormValues = {
  name: string;
  surname: string;
  documentType: string;
  documentNumber: string;
  grade: string;
  isNewStudent: boolean;
  email: string;
  parentPhone: string;
  secondaryPhone: string;
  housePhone: string;
  additionalInfo: string;
  price: string | number;
  billingInfo: {
    name: string;
    surname: string;
    documentType: string;
    documentNumber: string;
    phone: string;
    email: string;
    address: string;
  };
  locations: {
    morning?: LocationDetail;
    afternoon?: LocationDetail;
  };
};

type StudentInfoProps = {
  student: Student;
  onCloseModal: () => void;
  onStudentUpdated?: (student: Student) => void;
};

export default function StudentInfo({
  student,
  onCloseModal,
  onStudentUpdated,
}: StudentInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeMapTab, setActiveMapTab] = useState<"morning" | "afternoon">("morning");
  const [mutationError, setMutationError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const DynamicMapEditor = useMemo(
    () =>
      dynamic(() => import("./StudentLocationMapEditor"), {
        loading: () => (
          <div className="w-full h-[340px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-gray-500 text-sm">Cargando mapa interactivo...</p>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditFormValues>({
    defaultValues: {
      name: student.name || "",
      surname: student.surname || "",
      documentType: student.documentType || "CÉDULA",
      documentNumber: student.documentNumber || "",
      grade: student.grade || "",
      isNewStudent: student.isNewStudent ?? false,
      email: student.email || "",
      parentPhone: student.parentPhone || "",
      secondaryPhone: student.secondaryPhone || "",
      housePhone: student.housePhone || "",
      additionalInfo: student.additionalInfo || "",
      price: student.price ?? "",
      billingInfo: {
        name: student.billingInfo?.name || "",
        surname: student.billingInfo?.surname || "",
        documentType: student.billingInfo?.documentType || "CÉDULA",
        documentNumber: student.billingInfo?.documentNumber || "",
        phone: student.billingInfo?.phone || "",
        email: student.billingInfo?.email || "",
        address: student.billingInfo?.address || "",
      },
      locations: {
        morning: student.locations?.morning
          ? { ...student.locations.morning }
          : undefined,
        afternoon: student.locations?.afternoon
          ? { ...student.locations.afternoon }
          : undefined,
      },
    },
  });

  const watchedDocNumber = watch("documentNumber");
  const watchedLocations = watch("locations");
  const isDocumentAmended =
    watchedDocNumber && watchedDocNumber !== student.documentNumber;

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Student>) =>
      updateStudent(student.documentNumber, data),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onStudentUpdated?.(updatedStudent);
      setIsEditing(false);
      setMutationError(null);
    },
    onError: (err: any) => {
      console.error("Error updating student:", err);
      setMutationError(
        err?.response?.data?.message ||
          err?.message ||
          "Error al actualizar los datos del estudiante."
      );
    },
  });

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleLocationCoordChange = (
    period: "morning" | "afternoon",
    lat: number,
    lng: number
  ) => {
    const currentLoc = watchedLocations?.[period] || {
      mainStreet: "",
      neighborhood: "",
    };
    setValue(
      `locations.${period}`,
      {
        ...currentLoc,
        lat,
        lng,
      },
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const handleStartEditing = () => {
    reset({
      name: student.name || "",
      surname: student.surname || "",
      documentType: student.documentType || "CÉDULA",
      documentNumber: student.documentNumber || "",
      grade: student.grade || "",
      isNewStudent: student.isNewStudent ?? false,
      email: student.email || "",
      parentPhone: student.parentPhone || "",
      secondaryPhone: student.secondaryPhone || "",
      housePhone: student.housePhone || "",
      additionalInfo: student.additionalInfo || "",
      price: student.price ?? "",
      billingInfo: {
        name: student.billingInfo?.name || "",
        surname: student.billingInfo?.surname || "",
        documentType: student.billingInfo?.documentType || "CÉDULA",
        documentNumber: student.billingInfo?.documentNumber || "",
        phone: student.billingInfo?.phone || "",
        email: student.billingInfo?.email || "",
        address: student.billingInfo?.address || "",
      },
      locations: {
        morning: student.locations?.morning
          ? { ...student.locations.morning }
          : undefined,
        afternoon: student.locations?.afternoon
          ? { ...student.locations.afternoon }
          : undefined,
      },
    });
    setMutationError(null);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setMutationError(null);
  };

  const onSubmit = (formData: EditFormValues) => {
    const payload: Partial<Student> = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      documentType: formData.documentType,
      documentNumber: formData.documentNumber.trim(),
      grade: formData.grade,
      isNewStudent: formData.isNewStudent,
      email: formData.email.trim(),
      parentPhone: formData.parentPhone.trim(),
      secondaryPhone: formData.secondaryPhone?.trim() || undefined,
      housePhone: formData.housePhone?.trim() || undefined,
      additionalInfo: formData.additionalInfo?.trim() || undefined,
      price:
        formData.price === "" || formData.price === null || formData.price === undefined
          ? null
          : Number(formData.price),
      billingInfo: {
        name: formData.billingInfo.name.trim(),
        surname: formData.billingInfo.surname.trim(),
        documentType: formData.billingInfo.documentType,
        documentNumber: formData.billingInfo.documentNumber.trim(),
        phone: formData.billingInfo.phone.trim(),
        email: formData.billingInfo.email.trim(),
        address: formData.billingInfo.address.trim(),
      },
      locations: {
        morning: formData.locations?.morning?.lat
          ? {
              ...formData.locations.morning,
              lat: Number(formData.locations.morning.lat),
              lng: Number(formData.locations.morning.lng),
            }
          : undefined,
        afternoon: formData.locations?.afternoon?.lat
          ? {
              ...formData.locations.afternoon,
              lat: Number(formData.locations.afternoon.lat),
              lng: Number(formData.locations.afternoon.lng),
            }
          : undefined,
      },
    };

    updateMutation.mutate(payload);
  };

  // Price checks
  const numericPrice =
    student.price !== null && student.price !== undefined && student.price !== ""
      ? Number(student.price)
      : null;
  const hasValidPrice =
    numericPrice !== null && !isNaN(numericPrice) && numericPrice > 0;
  const isPendingContract =
    student.status === "PENDING_CONTRACT" ||
    (!student.contractKey && student.status !== "SIGNED");

  const signingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/registration/contract-signing?doc=${encodeURIComponent(
          student.documentNumber
        )}&schoolYear=${encodeURIComponent(student.schoolYear || "2026-2027")}`
      : "";

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-xs flex items-center justify-center z-[1000] p-4"
      onClick={onCloseModal}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex flex-col gap-3 border-b border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight">
                  {titleCase(student.name?.trim().toLowerCase() || "")}{" "}
                  {titleCase(student.surname?.trim().toLowerCase() || "")}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {student.grade || "Sin Grado"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span>
                  Año Lectivo:{" "}
                  <strong className="text-slate-200">
                    {student.schoolYear || "2026-2027"}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Registrado:{" "}
                  <strong className="text-slate-200">
                    {student.createdAt
                      ? new Date(student.createdAt).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </strong>
                </span>
                {student.isNewStudent && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      Estudiante Nuevo
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onCloseModal}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Editar Información
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar Edición
                </button>
              )}

              {hasValidPrice && isPendingContract && !isEditing && (
                <button
                  type="button"
                  onClick={() => handleCopy(signingUrl, "signing-link")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-sm"
                >
                  {copiedKey === "signing-link" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      ¡Enlace Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Enlace de Firma
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Doc:</span>
              <code className="text-xs bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">
                {student.documentType} {student.documentNumber}
              </code>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {mutationError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error al guardar cambios</p>
                <p className="mt-0.5 text-xs text-red-700">{mutationError}</p>
              </div>
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-6">
              {/* Pricing & Contract Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                  <div
                    className={`p-3 rounded-lg ${
                      hasValidPrice
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tarifa Mensual
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {hasValidPrice
                        ? `$${numericPrice?.toFixed(2)} USD/mes`
                        : "Sin tarifa asignada"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Estado Contrato
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {student.status === "CONTRACT_SUBMITTED"
                        ? "Contrato Firmado"
                        : "Pendiente de Firma"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 sm:col-span-2 md:col-span-1">
                  <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Rutas Asignadas
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {student.routes && student.routes.length > 0
                        ? `${student.routes.length} ruta(s) vinculada(s)`
                        : "Sin rutas"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Profile & Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                    <User className="w-4 h-4 text-blue-600" />
                    Información del Estudiante
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <DetailRow
                      label="Nombre Completo"
                      value={`${student.name} ${student.surname}`}
                    />
                    <DetailRow
                      label="Documento"
                      value={`${student.documentType}: ${student.documentNumber}`}
                      onCopy={() => handleCopy(student.documentNumber, "doc")}
                      copied={copiedKey === "doc"}
                    />
                    <DetailRow label="Grado" value={student.grade} />
                    <DetailRow
                      label="Estudiante Nuevo"
                      value={student.isNewStudent ? "Sí" : "No"}
                    />
                    <DetailRow
                      label="Año Lectivo"
                      value={student.schoolYear || "2026-2027"}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Información de Contacto
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <DetailRow
                      label="Teléfono Principal"
                      value={student.parentPhone}
                      onCopy={() => handleCopy(student.parentPhone, "parentPhone")}
                      copied={copiedKey === "parentPhone"}
                    />
                    {student.secondaryPhone && (
                      <DetailRow
                        label="Teléfono Secundario"
                        value={student.secondaryPhone}
                        onCopy={() =>
                          handleCopy(student.secondaryPhone!, "secPhone")
                        }
                        copied={copiedKey === "secPhone"}
                      />
                    )}
                    {student.housePhone && (
                      <DetailRow
                        label="Teléfono Casa"
                        value={student.housePhone}
                        onCopy={() =>
                          handleCopy(student.housePhone!, "housePhone")
                        }
                        copied={copiedKey === "housePhone"}
                      />
                    )}
                    <DetailRow
                      label="Email Estudiante"
                      value={student.email}
                      onCopy={() => handleCopy(student.email, "email")}
                      copied={copiedKey === "email"}
                    />
                  </div>
                </div>
              </div>

              {/* Billing Information Card */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <Home className="w-4 h-4 text-amber-600" />
                  Información de Facturación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                  <DetailRow
                    label="Representante"
                    value={`${student.billingInfo?.name || ""} ${
                      student.billingInfo?.surname || ""
                    }`}
                  />
                  <DetailRow
                    label="Documento"
                    value={`${student.billingInfo?.documentType || ""}: ${
                      student.billingInfo?.documentNumber || ""
                    }`}
                    onCopy={() =>
                      handleCopy(
                        student.billingInfo?.documentNumber || "",
                        "billingDoc"
                      )
                    }
                    copied={copiedKey === "billingDoc"}
                  />
                  <DetailRow
                    label="Email Facturación"
                    value={student.billingInfo?.email || ""}
                    onCopy={() =>
                      handleCopy(
                        student.billingInfo?.email || "",
                        "billingEmail"
                      )
                    }
                    copied={copiedKey === "billingEmail"}
                  />
                  <DetailRow
                    label="Teléfono"
                    value={student.billingInfo?.phone || ""}
                    onCopy={() =>
                      handleCopy(
                        student.billingInfo?.phone || "",
                        "billingPhone"
                      )
                    }
                    copied={copiedKey === "billingPhone"}
                  />
                  <div className="md:col-span-2">
                    <DetailRow
                      label="Dirección Fiscal"
                      value={student.billingInfo?.address || "No especificada"}
                    />
                  </div>
                </div>
              </div>

              {/* Stops & Locations Section */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Paradas y Ubicaciones de Transporte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Morning Stop */}
                  <div className="p-4 rounded-lg bg-blue-50/40 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Parada de Mañana
                      </span>
                      <RouteBadge
                        route={student.routes?.find((r) => r.period === "morning")}
                      />
                    </div>
                    {student.locations?.morning?.lat ? (
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p>
                          <strong className="text-slate-900">
                            Calle Principal:
                          </strong>{" "}
                          {student.locations.morning.mainStreet || "N/A"}
                        </p>
                        {student.locations.morning.secondaryStreet && (
                          <p>
                            <strong className="text-slate-900">
                              Calle Secundaria:
                            </strong>{" "}
                            {student.locations.morning.secondaryStreet}
                          </p>
                        )}
                        <p>
                          <strong className="text-slate-900">
                            Barrio/Sector:
                          </strong>{" "}
                          {student.locations.morning.neighborhood || "N/A"}
                        </p>
                        {student.locations.morning.referencePoints && (
                          <p>
                            <strong className="text-slate-900">
                              Referencia:
                            </strong>{" "}
                            {student.locations.morning.referencePoints}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 font-mono pt-1">
                          GPS: {student.locations.morning.lat},{" "}
                          {student.locations.morning.lng}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No registra parada de mañana.
                      </p>
                    )}
                  </div>

                  {/* Afternoon Stop */}
                  <div className="p-4 rounded-lg bg-purple-50/40 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        Parada de Tarde
                      </span>
                      <RouteBadge
                        route={student.routes?.find(
                          (r) => r.period === "afternoon"
                        )}
                      />
                    </div>
                    {student.locations?.afternoon?.lat ? (
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p>
                          <strong className="text-slate-900">
                            Calle Principal:
                          </strong>{" "}
                          {student.locations.afternoon.mainStreet || "N/A"}
                        </p>
                        {student.locations.afternoon.secondaryStreet && (
                          <p>
                            <strong className="text-slate-900">
                              Calle Secundaria:
                            </strong>{" "}
                            {student.locations.afternoon.secondaryStreet}
                          </p>
                        )}
                        <p>
                          <strong className="text-slate-900">
                            Barrio/Sector:
                          </strong>{" "}
                          {student.locations.afternoon.neighborhood || "N/A"}
                        </p>
                        {student.locations.afternoon.referencePoints && (
                          <p>
                            <strong className="text-slate-900">
                              Referencia:
                            </strong>{" "}
                            {student.locations.afternoon.referencePoints}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 font-mono pt-1">
                          GPS: {student.locations.afternoon.lat},{" "}
                          {student.locations.afternoon.lng}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No registra parada de tarde.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {student.additionalInfo && (
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    Observaciones Adicionales
                  </h3>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    {student.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* EDIT MODE */
            <form
              id="edit-student-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Document Number Amendment Warning */}
              {isDocumentAmended && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">
                      Advertencia: Modificación de Número de Documento
                    </p>
                    <p>
                      Está modificando el identificador principal del estudiante
                      de{" "}
                      <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">
                        {student.documentNumber}
                      </code>{" "}
                      a{" "}
                      <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">
                        {watchedDocNumber}
                      </code>
                      . Esta acción actualizará la clave de registro y los
                      enlaces de firma asociados.
                    </p>
                  </div>
                </div>
              )}

              {/* Student Profile Section */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Datos Personales del Estudiante
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Nombres *
                    </label>
                    <input
                      {...register("name", { required: "Campo requerido" })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Apellidos *
                    </label>
                    <input
                      {...register("surname", { required: "Campo requerido" })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.surname && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.surname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Tipo Documento
                    </label>
                    <select
                      {...register("documentType")}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {DOCUMENT_TYPES.map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Número Documento *
                    </label>
                    <input
                      {...register("documentNumber", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    {errors.documentNumber && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.documentNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Grado / Nivel *
                    </label>
                    <select
                      {...register("grade", { required: "Campo requerido" })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione grado...</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {errors.grade && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {errors.grade.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isNewStudent")}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-slate-800 font-medium">
                        ¿Es estudiante nuevo?
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing & Contact Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Fields */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Información de Contacto
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Teléfono Principal *
                      </label>
                      <input
                        {...register("parentPhone", {
                          required: "Campo requerido",
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.parentPhone && (
                        <p className="text-red-500 text-[11px] mt-1">
                          {errors.parentPhone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Teléfono Secundario
                      </label>
                      <input
                        {...register("secondaryPhone")}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Teléfono Convencional
                      </label>
                      <input
                        {...register("housePhone")}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Email del Estudiante *
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: "Campo requerido" })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[11px] mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Setting */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Asignación de Tarifa
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Tarifa Mensual (USD)
                      </label>
                      <div className="relative rounded-lg shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                          $
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...register("price")}
                          className="w-full pl-8 pr-16 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
                          USD/mes
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Fijar o actualizar el valor mensual para habilitar la
                        generación del contrato y enlace de firma.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-2">
                      <p className="font-semibold text-slate-700 text-xs">
                        Campos de Solo Lectura (Sistema):
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400">Año Lectivo:</span>{" "}
                          <strong className="text-slate-700">
                            {student.schoolYear || "2026-2027"}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Estado:</span>{" "}
                          <strong className="text-slate-700">
                            {student.status}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Tipo Firma:</span>{" "}
                          <strong className="text-slate-700">
                            {student.signatureType || "Sin definir"}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Contrato:</span>{" "}
                          <strong className="text-slate-700">
                            {student.contractKey ? "Cargado" : "Pendiente"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Information Form */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-600" />
                  Datos de Facturación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Nombres Representante *
                    </label>
                    <input
                      {...register("billingInfo.name", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Apellidos Representante *
                    </label>
                    <input
                      {...register("billingInfo.surname", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Tipo Documento Facturación
                    </label>
                    <select
                      {...register("billingInfo.documentType")}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {DOCUMENT_TYPES.map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Número Documento Facturación *
                    </label>
                    <input
                      {...register("billingInfo.documentNumber", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Email Facturación *
                    </label>
                    <input
                      type="email"
                      {...register("billingInfo.email", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Teléfono Facturación *
                    </label>
                    <input
                      {...register("billingInfo.phone", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block font-medium text-slate-700 mb-1">
                      Dirección Fiscal *
                    </label>
                    <input
                      {...register("billingInfo.address", {
                        required: "Campo requerido",
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stops & Map Editor Section */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Ubicaciones y Paradas en el Mapa
                  </h3>

                  {/* Period Switcher Tabs */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveMapTab("morning")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeMapTab === "morning"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Editar Parada Mañana
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMapTab("afternoon")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeMapTab === "afternoon"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Editar Parada Tarde
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Selecciona una parada en las pestañas y haz clic o arrastra el
                  marcador en el mapa para actualizar las coordenadas GPS.
                </p>

                {/* Interactive Leaflet Map Component */}
                <DynamicMapEditor
                  activePeriod={activeMapTab}
                  morningLocation={watchedLocations?.morning}
                  afternoonLocation={watchedLocations?.afternoon}
                  onLocationChange={handleLocationCoordChange}
                />

                {/* Address Details for active tab */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeMapTab === "morning"
                          ? "bg-blue-600"
                          : "bg-purple-600"
                      }`}
                    ></span>
                    Dirección de Parada (
                    {activeMapTab === "morning" ? "Mañana" : "Tarde"})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Calle Principal
                      </label>
                      <input
                        {...register(`locations.${activeMapTab}.mainStreet`)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Ej: Av. 10 de Agosto N34-20"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Calle Secundaria
                      </label>
                      <input
                        {...register(
                          `locations.${activeMapTab}.secondaryStreet`
                        )}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Ej: Mariana de Jesús"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Barrio / Sector
                      </label>
                      <input
                        {...register(`locations.${activeMapTab}.neighborhood`)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Ej: Rumipamba"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Puntos de Referencia
                      </label>
                      <input
                        {...register(
                          `locations.${activeMapTab}.referencePoints`
                        )}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Ej: Edificio Tates, dpto 4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Observations Field */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Observaciones Adicionales
                </label>
                <textarea
                  rows={3}
                  {...register("additionalInfo")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                  placeholder="Información relevante de transporte, horarios especiales, observaciones médicas..."
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center flex-wrap gap-3">
          <button
            type="button"
            onClick={onCloseModal}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Cerrar
          </button>

          {isEditing && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancelEditing}
                className="px-4 py-2 rounded-lg text-slate-600 text-xs font-medium hover:text-slate-900 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="edit-student-form"
                disabled={updateMutation.isPending}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white text-xs font-bold transition shadow-sm ${
                  updateMutation.isPending
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DetailRow = ({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value?: string | number | null;
  onCopy?: () => void;
  copied?: boolean;
}) => (
  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0">
    <span className="text-xs font-medium text-slate-500">{label}:</span>
    <div className="flex items-center gap-2 text-right">
      <span className="text-xs font-semibold text-slate-900">
        {value || "—"}
      </span>
      {onCopy && value && (
        <button
          type="button"
          onClick={onCopy}
          className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition"
          title="Copiar al portapapeles"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  </div>
);

const RouteBadge = ({ route }: { route: RouteAttr | undefined }) => {
  if (!route) {
    return (
      <span className="text-[11px] font-semibold text-slate-400 italic">
        Sin ruta asignada
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border"
      style={{
        backgroundColor: `${route.color}15`,
        color: route.color,
        borderColor: `${route.color}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: route.color }}
      ></span>
      {route.name}
    </span>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
  if (status === "SIGNED") {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
        SIGNED
      </span>
    );
  }
  if (status === "PENDING_CONTRACT") {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
        PENDING_CONTRACT
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
      {status || "SIN ESTADO"}
    </span>
  );
};
