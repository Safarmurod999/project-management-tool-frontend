import type { User, UsersResponse } from "@/entities/user";
import { apiClient } from "./client";

export interface RolesResponse {
  success: boolean;
  data: User[];
  status: number;
}

export const userApi = {
  getAll: async (): Promise<RolesResponse> => {
    const response = await apiClient.get<RolesResponse>("/users");
    return response.data;
  },

  getById: async (id: string): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>(`/users/${id}`);
    return response.data;
  },
};
