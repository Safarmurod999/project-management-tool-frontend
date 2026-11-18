import { useRoleStore, type RoleResponse } from "@/entities/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateRoleFormData, UpdateRoleFormData } from "./schema";
import { roleApi } from "@/shared/api/role";

export const useRoleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleFormData) => roleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useRoles = () => {
  const setRoles = useRoleStore((state) => state.setRoles);

  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const response = await roleApi.getAll();
        setRoles(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const useRole = (id: string) => {
  const setRole = useRoleStore((state) => state.setRole);

  return useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      try {
        const response = await roleApi.getById(id);
        setRole(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!id,
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleFormData }) =>
      roleApi.update(id, data),
    onSuccess: (response: RoleResponse) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({
        queryKey: ["role", response.data.id],
      });
    },
  });
};

export const useRoleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
