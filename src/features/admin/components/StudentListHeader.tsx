import { Student } from "@/types";

type StudentListHeaderProps = {
    students: Student[];
}

export default function StudentListHeader({ students }: StudentListHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Lista de Estudiantes</h2>
                            <p className="text-sm text-gray-600">{students.length} estudiante{students.length !== 1 ? 's' : ''} encontrado{students.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {students.filter(s => s.routes && s.routes.length > 0).length} con rutas
                        </div>
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            {students.filter(s => !s.routes || s.routes.length === 0).length} sin rutas
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}