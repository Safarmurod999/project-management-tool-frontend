import type { TeamResponse, Team } from "@/entities/team";
import type { CreateTeamFormData, UpdateTeamFormData } from "@/features/team/model/schema";
import { apiClient } from "./client";

export interface TeamsResponse {
  success: boolean;
  data: Team[];
  status: number;
}

export const teamApi = {
  create: async (data: CreateTeamFormData): Promise<TeamResponse> => {
    const response = await apiClient.post<TeamResponse>("/teams", data);
    return response.data;
  },

  getAll: async (): Promise<TeamsResponse> => {
    const response = await apiClient.get<TeamsResponse>("/teams");
    return response.data;
  },

  getById: async (id: string): Promise<TeamResponse> => {
    const response = await apiClient.get<TeamResponse>(`/teams/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateTeamFormData): Promise<TeamResponse> => {
    const response = await apiClient.put<TeamResponse>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },
};
