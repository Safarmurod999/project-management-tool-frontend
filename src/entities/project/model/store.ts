import { create } from "zustand";
import type { Project, ProjectState } from "./types";

export const useProjectStore = create<ProjectState>((set) => {
  return {
    projects: [],
    project: null,
    isLoading: false,
    setProjects: (projects: Project[]) =>
      set(() => ({
        projects,
      })),
    setProject: (project: Project | null) =>
      set(() => ({
        project,
      })),
    setLoading: (isLoading: boolean) =>
      set(() => ({
        isLoading,
      })),
  };
});
