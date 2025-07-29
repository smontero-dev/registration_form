import apiClient from "./apiClient";

interface AuthorizeResponse {
  authorized: boolean;
}

export const validateToken = (token: string): Promise<AuthorizeResponse> => {
  return apiClient.post("/authorize", { token });
};

export const checkAuthStatus = (): Promise<AuthorizeResponse> => {
  return apiClient.get("/auth/status");
};
