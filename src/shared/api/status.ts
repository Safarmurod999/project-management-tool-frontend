import type {
  ApiResponse,
  PaginatedResponse,
  Status,
} from "@/entities/board";
import type {
  CreateStatusFormData,
  UpdateStatusFormData,
} from "@/features/board/model/schema";
import { apiClient } from "./client";

export interface StatusFilters {
  projectId: string;
  page?: number;
  limit?: number;
  name?: string;
  code?: string;
}

export const statusApi = {
  create: async (data: CreateStatusFormData): Promise<ApiResponse<Status>> => {
    const response = await apiClient.post<ApiResponse<Status>>(
      "/statuses",
      data,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateStatusFormData,
  ): Promise<ApiResponse<Status>> => {
    const response = await apiClient.put<ApiResponse<Status>>(
      `/statuses/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/statuses/${id}`);
  },

  getAll: async (params: StatusFilters): Promise<PaginatedResponse<Status>> => {
    const response = await apiClient.get<PaginatedResponse<Status>>(
      "/statuses",
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Status>> => {
    const response = await apiClient.get<ApiResponse<Status>>(
      `/statuses/${id}`,
    );
    return response.data;
  },
};
