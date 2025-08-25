"use client";

import { FixedSizeList as List } from 'react-window';
import StudentInfo from "./StudentInfo";
import StudentRow from './StudentRow';
import { Student } from '@/types';
import { useState, useRef } from 'react';
import StudentListHeader from './StudentListHeader';
import AutoSizer from "react-virtualized-auto-sizer";

type StudentListProps = {
    students: Student[];
    isLoading: boolean;
}

export default function StudentList({ students, isLoading }: StudentListProps) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const listRef = useRef<List>(null);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 text-sm">Cargando estudiantes...</p>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-sm">No hay estudiantes registrados</p>
                <p className="text-gray-400 text-xs mt-1">Los estudiantes aparecerán aquí cuando se registren</p>
            </div>
        );
    }

    // Row renderer for the virtualized list
    const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        const student = students[index];
        return (
            <div style={style}>
                <StudentRow student={student} openModal={(student: Student) => setSelectedStudent(student)} />
            </div>
        );
    };

    // Handle scroll to show/hide scroll to top button
    const handleScroll = ({ scrollOffset }: { scrollOffset: number }) => {
        setShowScrollToTop(scrollOffset > 200); // Show button after scrolling 200px
    };

    const scrollToTop = () => {
        listRef.current?.scrollToItem(0, 'start');
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <StudentListHeader students={students} />

            {/* Student List */}
            <div className="flex-1 overflow-hidden relative">
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={listRef}
                            height={height}
                            width={width}
                            itemCount={students.length}
                            itemSize={88}
                            onScroll={handleScroll}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>

                {/* Scroll to Top Button */}
                {showScrollToTop && (
                    <button
                        onClick={scrollToTop}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-10"
                        aria-label="Volver al inicio"
                    >
                        <svg
                            className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                )}
            </div>

            {selectedStudent && (
                <StudentInfo
                    student={selectedStudent}
                    onCloseModal={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
}