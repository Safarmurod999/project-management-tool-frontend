import type { ProjectResponse, Project } from "@/entities/project";
import type { CreateProjectFormData, UpdateProjectFormData } from "@/features/project/model/schema";
import { apiClient } from "./client";

export interface ProjectsResponse {
  success: boolean;
  data: {
    myProjects: Project[];
    participatedProjects: Project[];
  };
  status: number;
}

export const projectApi = {
  create: async (data: CreateProjectFormData): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>("/projects", data);
    return response.data;
  },

  getAll: async (): Promise<ProjectsResponse> => {
    const response = await apiClient.get<ProjectsResponse>("/projects");
    return response.data;
  },

  getById: async (id: string): Promise<ProjectResponse> => {
    const response = await apiClient.get<ProjectResponse>(`/projects/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateProjectFormData): Promise<ProjectResponse> => {
    const response = await apiClient.put<ProjectResponse>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
