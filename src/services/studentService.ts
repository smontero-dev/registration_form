import { Student } from "@/types";
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
