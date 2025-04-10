import { createGroupRequest } from "../types/groupTypes";
import api from "./api";

export default async function createGroupService(data: createGroupRequest) {
  const response = await api.post("/group/create", data);
  return response;
}
