import { create } from "zustand";
import type { Project, ProjectData, ProjectState } from "./types";

export const useProjectStore = create<ProjectState>((set) => {
  return {
    projects: {
      myProjects: [],
      participatedProjects: [],
    },
    project: null,
    isLoading: false,
    setProjects: (projects: ProjectData) =>
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
