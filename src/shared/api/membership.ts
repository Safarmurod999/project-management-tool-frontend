import type { MembershipResponse, Membership } from "@/entities/membership";
import type {
  CreateMembershipFormData,
  UpdateMembershipFormData,
} from "@/features/membership/model/schema";
import { apiClient } from "./client";

export interface MembershipsResponse {
  success: boolean;
  data: Membership[];
  status: number;
}

export interface MembershipFilters {
  page?: number;
  limit?: number;
  userId?: string;
  scopeType?: "team" | "project" | "board";
  scopeId?: string;
  roleId?: string;
}

export const membershipApi = {
  create: async (
    data: CreateMembershipFormData,
  ): Promise<MembershipResponse> => {
    const response = await apiClient.post<MembershipResponse>(
      "/memberships",
      data,
    );
    return response.data;
  },

  getAll: async (params?: MembershipFilters): Promise<MembershipsResponse> => {
    const response = await apiClient.get<MembershipsResponse>("/memberships", {
      params,
    });

    return response.data;
  },

  getById: async (id: string): Promise<MembershipResponse> => {
    const response = await apiClient.get<MembershipResponse>(
      `/memberships/${id}`,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateMembershipFormData,
  ): Promise<MembershipResponse> => {
    const response = await apiClient.put<MembershipResponse>(
      `/memberships/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/memberships/${id}`);
  },
};
