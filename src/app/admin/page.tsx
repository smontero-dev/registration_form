"use client";

import StudentList from "@/features/admin/components/StudentList";

export default function AdminPage() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[70%] h-full">
          <h1>MAP</h1>
        </div>
        <div className="w-[30%] h-full border-l overflow-y-auto">
          <StudentList />
        </div>
      </main>
    </div>
  );
}