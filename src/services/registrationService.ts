import { RegistrationSchema } from "@/features/registration/schema";
import apiClient from "./apiClient";

interface AddRegistrationResponse {
  id: string;
}

export const addRegistration = (
  data: RegistrationSchema
): Promise<AddRegistrationResponse> => {
  return apiClient.post("/student-form", data);
};

export const uploadContract = (id: string, file: File): Promise<unknown> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post(`/upload-contract/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
