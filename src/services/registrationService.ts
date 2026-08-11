import { Student } from "@/types";
import apiClient from "./apiClient";

interface AddRegistrationResponse {
  documentNumber: string;
  schoolYear: string;
}

export const addRegistration = (
  // data: RegistrationSchema
  data: unknown
): Promise<AddRegistrationResponse> => {
  return apiClient.post("/student-form", data);
};

export const fetchRegistrationForSigning = (
  documentNumber: string,
  schoolYear: string
): Promise<Student> => {
  return apiClient.get(
    `/student-form/student/${documentNumber}/${schoolYear}`
  );
};

export const uploadContract = (
  documentNumber: string,
  schoolYear: string,
  blob: Blob
): Promise<unknown> => {
  const formData = new FormData();
  formData.append("file", blob);

  return apiClient.post(
    `/student-form/student/${documentNumber}/${schoolYear}/contract`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
