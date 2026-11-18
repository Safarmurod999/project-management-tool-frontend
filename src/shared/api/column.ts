import type {
  ApiResponse,
  BoardColumn,
  ColumnStatus,
  PaginatedResponse,
} from "@/entities/board";
import type {
  AddColumnStatusFormData,
  CreateColumnFormData,
  UpdateColumnFormData,
} from "@/features/board/model/schema";
import { apiClient } from "./client";

export interface ColumnFilters {
  boardId: string;
  page?: number;
  limit?: number;
  name?: string;
}

export const columnApi = {
  create: async (
    data: CreateColumnFormData,
  ): Promise<ApiResponse<BoardColumn>> => {
    const response = await apiClient.post<ApiResponse<BoardColumn>>(
      "/columns",
      data,
    );
    return response.data;
  },

  getAll: async (
    params: ColumnFilters,
  ): Promise<PaginatedResponse<BoardColumn>> => {
    const response = await apiClient.get<PaginatedResponse<BoardColumn>>(
      "/columns",
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<BoardColumn>> => {
    const response = await apiClient.get<ApiResponse<BoardColumn>>(
      `/columns/${id}`,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateColumnFormData,
  ): Promise<ApiResponse<BoardColumn>> => {
    const response = await apiClient.put<ApiResponse<BoardColumn>>(
      `/columns/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/columns/${id}`);
  },

  getStatuses: async (id: string): Promise<ApiResponse<ColumnStatus[]>> => {
    const response = await apiClient.get<ApiResponse<ColumnStatus[]>>(
      `/columns/${id}/statuses`,
    );
    return response.data;
  },

  addStatus: async (
    id: string,
    data: AddColumnStatusFormData,
  ): Promise<ApiResponse<ColumnStatus>> => {
    const response = await apiClient.post<ApiResponse<ColumnStatus>>(
      `/columns/${id}/statuses`,
      data,
    );
    return response.data;
  },

  removeStatus: async (id: string, statusId: string): Promise<void> => {
    await apiClient.delete(`/columns/${id}/statuses/${statusId}`);
  },
};
