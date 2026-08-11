// import { RegistrationSchema } from "@/features/registration/schema";
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
