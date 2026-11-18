import type {
  ApiResponse,
  BoardCard,
  MyCard,
  PaginatedResponse,
} from "@/entities/board";
import type {
  CreateCardFormData,
  UpdateCardFormData,
} from "@/features/board/model/schema";
import { apiClient } from "./client";

export interface CardFilters {
  columnId: string;
  page?: number;
  limit?: number;
  title?: string;
  statusId?: string;
}

export interface MyCardFilters {
  page?: number;
  limit?: number;
  projectId?: string;
  statusId?: string;
  title?: string;
  /** true: cards in a done status, false: open cards, omitted: all */
  done?: boolean;
}

export interface ReorderCardPayload {
  cardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  newIndex: number;
  statusId?: string;
}

/** Either the workflow rule to apply or its target status */
export type TransitionCardPayload =
  | { transitionId: string; toStatusId?: never }
  | { toStatusId: string; transitionId?: never };

export const cardApi = {
  create: async (data: CreateCardFormData): Promise<ApiResponse<BoardCard>> => {
    const response = await apiClient.post<ApiResponse<BoardCard>>(
      "/cards",
      data,
    );
    return response.data;
  },

  getAll: async (params: CardFilters): Promise<PaginatedResponse<BoardCard>> => {
    const response = await apiClient.get<PaginatedResponse<BoardCard>>(
      "/cards",
      { params },
    );
    return response.data;
  },

  /** Cards assigned to the current user across all projects, newest first */
  getMy: async (params?: MyCardFilters): Promise<PaginatedResponse<MyCard>> => {
    const response = await apiClient.get<PaginatedResponse<MyCard>>(
      "/cards/my",
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<BoardCard>> => {
    const response = await apiClient.get<ApiResponse<BoardCard>>(
      `/cards/${id}`,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateCardFormData,
  ): Promise<ApiResponse<BoardCard>> => {
    const response = await apiClient.put<ApiResponse<BoardCard>>(
      `/cards/${id}`,
      data,
    );
    return response.data;
  },

  reorder: async (
    data: ReorderCardPayload,
  ): Promise<ApiResponse<BoardCard>> => {
    const response = await apiClient.patch<ApiResponse<BoardCard>>(
      "/cards/reorder",
      data,
    );
    return response.data;
  },

  /** Applies a workflow transition; the card moves to the column holding the new status */
  transition: async (
    id: string,
    data: TransitionCardPayload,
  ): Promise<ApiResponse<BoardCard>> => {
    const response = await apiClient.post<ApiResponse<BoardCard>>(
      `/cards/${id}/transition`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/cards/${id}`);
  },
};
