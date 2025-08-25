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
    // In a real implementation, this would make an API call
    // using apiClient to get the students data
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    console.log(accessToken?.toString())
    const response = apiClient.get("/students", {
        headers: {
            Authorization: idToken?.toString() ?? '',
        }
    });
    return (await response).data
};