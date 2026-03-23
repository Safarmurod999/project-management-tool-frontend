import { useTeamStore, type TeamResponse } from "@/entities/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTeamFormData, UpdateTeamFormData } from "./schema";
import { teamApi } from "@/shared/api/team";

export const useTeamCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamFormData) => teamApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useTeams = () => {
  const setTeams = useTeamStore((state) => state.setTeams);
  const setLoading = useTeamStore((state) => state.setLoading);

  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await teamApi.getAll();
        setTeams(response.data);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
  });
};

export const useTeam = (id: string) => {
  const setTeam = useTeamStore((state) => state.setTeam);
  const setLoading = useTeamStore((state) => state.setLoading);

  return useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await teamApi.getById(id);
        setTeam(response.data);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!id,
  });
};

export const useTeamUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamFormData }) =>
      teamApi.update(id, data),
    onSuccess: (response: TeamResponse) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", response.data.id] });
    },
  });
};

export const useTeamDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
