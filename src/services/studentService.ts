import { Student, StudentProfileResponse } from "@/types";
import apiClient from "./apiClient";
import { fetchAuthSession } from "aws-amplify/auth";

interface StudentsResponse {
  students: Student[];
}

/**
 * Fetches all student records from the system
 * @returns {StudentsResponse} Object containing array of students
 */
export const fetchAllStudents = async (): Promise<StudentsResponse> => {
  const { idToken } = (await fetchAuthSession()).tokens ?? {};
  const response: Student[] = await apiClient.get("/students", {
    headers: {
      Authorization: idToken?.toString() ?? "",
    },
  });
  return { students: response };
};

/**
 * Fetches student profile summary by document number to check existing status and assigned price.
 * Gracefully falls back to a new student profile ({ isNewStudent: true, price: null }) on error or 404.
 */
export const fetchStudentProfileByDocument = async (
  documentNumber: string
): Promise<StudentProfileResponse> => {
  try {
    const response: StudentProfileResponse = await apiClient.get(
      `/students/profile/${documentNumber}`
    );
    return response;
  } catch (error) {
    console.error(
      "Failed to fetch student profile, falling back to new student defaults:",
      error
    );
    return { isNewStudent: true, price: null };
  }
};
