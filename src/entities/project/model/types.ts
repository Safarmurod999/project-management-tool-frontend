export interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
    myProjects: Project[];
    participatedProjects: Project[];
}

export interface ProjectResponse {
  success: boolean;
  status: number;
  data: Project;
}

export const ProjectStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatusEnum = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface ProjectState {
  projects: ProjectData | null;
  project: Project | null;
  isLoading: boolean;
  setProjects: (projects: ProjectData) => void;
  setProject: (project: Project | null) => void;
  setLoading: (isLoading: boolean) => void;
}
