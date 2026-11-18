import type { ApiResponse } from "@/entities/board";
import type {
  Notification,
  NotificationsResponse,
} from "@/entities/notification";
import { apiClient } from "./client";

export interface NotificationFilters {
  page?: number;
  limit?: number;
  /** Only unread notifications */
  unread?: boolean;
}

export const notificationApi = {
  getAll: async (
    params?: NotificationFilters,
  ): Promise<NotificationsResponse> => {
    const response = await apiClient.get<NotificationsResponse>(
      "/notifications",
      { params },
    );
    return response.data;
  },

  markRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch<ApiResponse<Notification>>(
      `/notifications/${id}/read`,
    );
    return response.data;
  },

  markAllRead: async (): Promise<ApiResponse<{ updated: number }>> => {
    const response = await apiClient.patch<ApiResponse<{ updated: number }>>(
      "/notifications/read-all",
    );
    return response.data;
  },
};
