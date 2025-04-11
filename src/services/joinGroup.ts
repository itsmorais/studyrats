import api from "./api";

export async function joinGroupService(groupCode: string) {
  const response = await api.post("/group/join", { groupCode });
  return response.data;
}
