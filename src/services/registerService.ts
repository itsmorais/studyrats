import api from "./api";

export default async function registerService(name:string,email: string, password: string) {
  const response = await api.post("/register", {
    name,email, password
  });
  return response
}