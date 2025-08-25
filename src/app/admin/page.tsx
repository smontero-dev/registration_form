"use client";

import SearchBox from "@/features/admin/components/SearchBox";
import StudentList from "@/features/admin/components/StudentList";
import { fetchAllStudents } from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: fetchAllStudents,
    staleTime: 60 * 60 * 1000, // 1 hour cache
    select: (data) => {
      return {
        ...data,
        students: data.students
          .sort((a, b) => a.studentSurname.trim().localeCompare(b.studentSurname.trim()))
      }
    }
  });

  const filteredStudents = useMemo(() => {
    if (!data?.students || !searchTerm.trim()) return data?.students ?? [];

    return data.students.filter(student => {
      const fullName = `${student.studentName} ${student.studentSurname}`.toLowerCase();
      return fullName.includes(searchTerm.trim().toLowerCase());
    });
  }, [data?.students, searchTerm]);

  return (
    <div className="h-full flex">
      <div className="w-[70%] h-full">
        <h1>MAP</h1>
      </div>
      <div className="w-[30%] h-full border-l flex flex-col">
        <SearchBox query={searchTerm} onQueryChange={setSearchTerm} placeholder="Buscar estudiantes..." />
        <div className="flex-1 overflow-y-auto">
          {error ? <div className="text-red-500 p-6">Error: {(error as Error).message}</div> : null}
          <StudentList students={filteredStudents} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}