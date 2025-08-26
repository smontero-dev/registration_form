"use client";

import FiltersSection from "@/features/admin/components/FiltersSection";
import StudentList from "@/features/admin/components/StudentList";
import { fetchAllStudents } from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewStudentsOnly, setShowNewStudentsOnly] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
    staleTime: 60 * 60 * 1000, // 1 hour cache
    select: (data) => {
      return {
        ...data,
        students: data.students.sort((a, b) =>
          a.studentSurname.trim().localeCompare(b.studentSurname.trim())
        ),
      };
    },
  });

  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];

    let filtered = data.students;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((student) => {
        const fullName =
          `${student.studentName} ${student.studentSurname}`.toLowerCase();
        return fullName.includes(searchTerm.trim().toLowerCase());
      });
    }

    // Filter by new students only
    if (showNewStudentsOnly) {
      filtered = filtered.filter((student) => student.isNewStudent);
    }

    return filtered;
  }, [data?.students, searchTerm, showNewStudentsOnly]);

  return (
    <div className="h-full flex">
      <div className="w-[70%] h-full">
        <div className="items-center justify-center h-full flex">
          <h1>MAP</h1>
        </div>
      </div>
      <div className="w-[30%] h-full border-l flex flex-col">
        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showNewStudentsOnly={showNewStudentsOnly}
          setShowNewStudentsOnly={setShowNewStudentsOnly}
        />
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="text-red-500 p-6">
              Error: {(error as Error).message}
            </div>
          ) : null}
          <StudentList students={filteredStudents} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
