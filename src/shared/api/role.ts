import type { RoleResponse, Roles } from "@/entities/role";
import type {
  CreateRoleFormData,
  UpdateRoleFormData,
} from "@/features/role/model/schema";
import { apiClient } from "./client";

export interface RolesResponse {
  success: boolean;
  data: Roles[];
  status: number;
}

export const roleApi = {
  create: async (data: CreateRoleFormData): Promise<RoleResponse> => {
    const response = await apiClient.post<RoleResponse>("/roles", data);
    return response.data;
  },

  getAll: async (): Promise<RolesResponse> => {
    const response = await apiClient.get<RolesResponse>("/roles");
    return response.data;
  },

  getById: async (id: string): Promise<RoleResponse> => {
    const response = await apiClient.get<RoleResponse>(`/roles/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateRoleFormData,
  ): Promise<RoleResponse> => {
    const response = await apiClient.put<RoleResponse>(
      `/roles/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },
};
