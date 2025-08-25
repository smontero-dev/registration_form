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
                            <p className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                                {titleCase(student.studentSurname.trim().toLowerCase())}, {titleCase(student.studentName.trim().toLowerCase())}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                {hasRoutes ? (
                                    student.routes!.map((route, index) => (
                                        <RouteBadge key={index} route={route} />
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500 italic">Sin rutas asignadas</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

const RouteBadge = ({ route }: { route: RouteAttr }) => {
    const getRouteColor = (color: string) => {
        return `bg-blue-100 text-blue-800 border-blue-200`;
    }

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRouteColor(route.color)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60"></span>
            {route.name} - {route.period}
        </span>
    );
};