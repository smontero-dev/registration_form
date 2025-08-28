"use client";

import StudentsView from "@/features/admin/components/StudentsView";
import { fetchAllStudents } from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";
import { useAdminMode } from "@/contexts/AdminModeContext";

export default function AdminPage() {
  const { mode } = useAdminMode();

  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
    staleTime: 60 * 60 * 1000, // 1 hour cache
    select: (data) => {
      return {
        students: data.students.sort((a, b) =>
          a.studentSurname.trim().localeCompare(b.studentSurname.trim())
        ),
      };
    },
  });
  console.log("AdminPage render, mode:", mode);

  return (
    <>
      {mode === "students" ? (
        <>
          <StudentsView
            students={studentsQuery.data?.students || []}
            isLoading={studentsQuery.isLoading}
          />
          {studentsQuery.error && (
            <div className="text-red-500 p-6">
              Error: {(studentsQuery.error as Error).message}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Próximamente...
        </div>
      )}
    </>
  );
}
