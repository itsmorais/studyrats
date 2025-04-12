import api from "./api";
import { CreateStudyLogData } from "../types/logTypes";

export async function createStudyLogService(data: CreateStudyLogData) {
  const response = await api.post("/log/create", {
    title: data.title,
    note: data.note,
    studiedAt: data.studiedAt,
    imageUrl: data.imageUrl,
    groupIds: data.groupIds,
  });

  return response.data;
}
