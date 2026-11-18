import type {
  ApiResponse,
  Board,
  BoardDetails,
  PaginatedResponse,
} from "@/entities/board";
import type {
  CreateBoardFormData,
  UpdateBoardFormData,
} from "@/features/board/model/schema";
import { apiClient } from "./client";

export interface BoardFilters {
  projectId?: string;
  page?: number;
  limit?: number;
  name?: string;
}

export const boardApi = {
  create: async (data: CreateBoardFormData): Promise<ApiResponse<Board>> => {
    const response = await apiClient.post<ApiResponse<Board>>("/boards", data);
    return response.data;
  },

  getAll: async (params?: BoardFilters): Promise<PaginatedResponse<Board>> => {
    const response = await apiClient.get<PaginatedResponse<Board>>("/boards", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Board>> => {
    const response = await apiClient.get<ApiResponse<Board>>(`/boards/${id}`);
    return response.data;
  },

  getDetails: async (id: string): Promise<ApiResponse<BoardDetails>> => {
    const response = await apiClient.get<ApiResponse<BoardDetails>>(
      `/boards/${id}/details`,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateBoardFormData,
  ): Promise<ApiResponse<Board>> => {
    const response = await apiClient.put<ApiResponse<Board>>(
      `/boards/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/boards/${id}`);
  },
};
