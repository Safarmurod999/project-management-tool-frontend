import {
  useMembershipStore,
  type MembershipResponse,
} from "@/entities/membership";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateMembershipFormData,
  UpdateMembershipFormData,
} from "./schema";
import { membershipApi } from "@/shared/api/membership";

export interface MembershipFilters {
  page?: number;
  limit?: number;
  userId?: string;
  scopeType?: "team" | "project" | "board";
  scopeId?: string;
  roleId?: string;
}

export const useMemberships = (filters?: MembershipFilters) => {
  const setMemberships = useMembershipStore((state) => state.setMemberships);

  return useQuery({
    queryKey: ["memberships", filters],
    queryFn: async () => {
      try {
        const response = await membershipApi.getAll(filters);
        setMemberships(response.data);
        return response.data;
      } catch (error) {
        setMemberships([]);
        throw error;
      }
    },
  });
};


export const useMembershipCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMembershipFormData) => membershipApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "memberships" ||
            query.queryKey[0] === "team-members"
          );
        },
      });
    },
  });
};

export const useMembership = (id: string) => {
  const setMembership = useMembershipStore((state) => state.setMembership);
  return useQuery({
    queryKey: ["membership", id],
    queryFn: async () => {
      try {
        const response = await membershipApi.getById(id);
        setMembership(response.data);
        return response.data;
      } catch (error) {
        setMembership(null);
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useMembershipUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMembershipFormData;
    }) => membershipApi.update(id, data),
    onSuccess: (response: MembershipResponse) => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      queryClient.invalidateQueries({
        queryKey: ["membership", response.data.id],
      });
    },
  });
};

export const useMembershipDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membershipApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "memberships" ||
            query.queryKey[0] === "team-members"
          );
        },
      });
    },
  });
};
