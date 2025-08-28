import { Student } from "@/types";
import { useMemo, useState } from "react";
import MapSection from "./StudentMapSection";
import FiltersSection from "./StudentFiltersSection";
import StudentListHeader from "./StudentListHeader";
import StudentList from "./StudentList";

type StudentsViewProps = {
    students: Student[];
    isLoading: boolean;
}

export default function StudentsView({ students, isLoading }: StudentsViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewStudentsOnly, setShowNewStudentsOnly] = useState(false);
    const [viewPeriod, setViewPeriod] = useState<"morning" | "both" | "afternoon">(
        "both"
    );

    const filteredStudents = useMemo(() => {
        if (students.length === 0) return [];

        let filtered = students;

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter((student) => {
                const fullName = `${student.studentName
                    .split(" ")
                    .join("")}${student.studentSurname
                        .split(" ")
                        .join("")}`.toLowerCase();
                return fullName.includes(
                    searchTerm.split(" ").join("").trim().toLowerCase()
                );
            });
        }

        // Filter by new students only
        if (showNewStudentsOnly) {
            filtered = filtered.filter((student) => student.isNewStudent);
        }

        // Filter by view mode
        if (viewPeriod === "morning") {
            filtered = filtered.filter(
                (student) =>
                    student.location.morning.lat && student.location.morning.lng
            );
        } else if (viewPeriod === "afternoon") {
            filtered = filtered.filter(
                (student) =>
                    student.location.afternoon.lat && student.location.afternoon.lng
            );
        }

        return filtered;
    }, [students, searchTerm, showNewStudentsOnly, viewPeriod]);

    return (
        <div className="h-full flex">
            <div className="w-[70%] h-full">
                <MapSection
                    students={filteredStudents}
                    viewMode={viewPeriod}
                    setViewMode={setViewPeriod}
                />
            </div>
            <div className="w-[30%] h-full border-l flex flex-col">
                <FiltersSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showNewStudentsOnly={showNewStudentsOnly}
                    setShowNewStudentsOnly={setShowNewStudentsOnly}
                />
                <div className="flex-1 overflow-y-auto">
                    <StudentListHeader students={filteredStudents} />
                    <StudentList students={filteredStudents} isLoading={isLoading} />
                </div>
            </div>
        </div>
    )
}