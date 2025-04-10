import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("studyrat_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("studyrat_token");
      localStorage.removeItem("studyrat_user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
