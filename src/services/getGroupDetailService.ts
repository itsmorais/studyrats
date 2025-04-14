import api from "./api";


export async function getGroupDetailService(groupId: number) {
  const response = await api.get(`/group/${groupId}/detail`);
  return response.data;
}
