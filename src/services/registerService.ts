import api from "./api";

export default async function registerService(name: string, email: string, password: string, avatarUrl: string) {
  const response = await api.post("/register", {
    name, email, password, avatarUrl
  });
  return response
}