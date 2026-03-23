export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface TeamResponse {
  success: boolean;
  data: Team;
  status: number;
}

export interface TeamState {
  teams: Team[];
  team: Team | null;
  isLoading: boolean;
  setTeams: (teams: Team[]) => void;
  setTeam: (team: Team | null) => void;
  setLoading: (isLoading: boolean) => void;
}
