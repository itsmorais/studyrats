import api from "./api";

export default async function authService(email: string, password: string) {
  const response = await api.post("/session", {
    email, password
  });
  return response
}