import api from "./api";
import { StudyGroup } from "../types/index";

export async function listGroupServices(): Promise<StudyGroup[]> {
  const response = await api.get("/group/list");
  return response.data
}
