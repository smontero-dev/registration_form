import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
