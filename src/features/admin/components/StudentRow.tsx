"use client";

import { RouteAttr, Student } from "@/types";
import { titleCase } from "title-case";

type StudentRowProps = {
  student: Student;
  openModal: (student: Student) => void;
};

export default function StudentRow({ student, openModal }: StudentRowProps) {
  const hasRoutes = student.routes && student.routes.length > 0;

  return (
    <div
      onClick={() => openModal(student)}
      className="group p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50/50 transition-all duration-200 hover:border-blue-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                  {titleCase(student.studentSurname.trim().toLowerCase())},{" "}
                  {titleCase(student.studentName.trim().toLowerCase())}
                </p>
                {student.isNewStudent && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Nuevo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {hasRoutes ? (
                  student.routes!.map((route, index) => (
                    <RouteBadge key={index} route={route} />
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">
                    Sin rutas asignadas
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

const RouteBadge = ({ route }: { route: RouteAttr }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-white`}
      style={{ color: route.color, borderColor: route.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60"></span>
      {route.name} - {route.period}
    </span>
  );
};
