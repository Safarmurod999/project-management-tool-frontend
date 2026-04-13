export interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse {
  success: boolean;
  status: number;
  data: Project[];
}

export interface ProjectState {
  projects: Project[] | null;
  project: Project | null;
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  setProject: (project: Project | null) => void;
  setLoading: (isLoading: boolean) => void;
}
