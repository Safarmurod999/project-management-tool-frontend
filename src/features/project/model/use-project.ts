import { useProjectStore, type ProjectResponse } from "@/entities/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectFormData, UpdateProjectFormData } from "./schema";
import { projectApi } from "@/shared/api/project";

export const useProjectCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectFormData) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useProjects = () => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const setLoading = useProjectStore((state) => state.setLoading);

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await projectApi.getAll();
        setProjects(response.data);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
  });
};

export const useProject = (id: string) => {
  const setProject = useProjectStore((state) => state.setProject);
  const setLoading = useProjectStore((state) => state.setLoading);

  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await projectApi.getById(id);
        setProject(response.data);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!id,
  });
};

export const useProjectUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectFormData }) =>
      projectApi.update(id, data),
    onSuccess: (response: ProjectResponse) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", response.data.id],
      });
    },
  });
};

export const useProjectDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
