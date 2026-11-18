export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface TeamMembers {
  id: string;
  user: {
    name: string;
    email: string;
  };
  role: {
    name: string;
    description: string;
    code: string;
  };
  scopeType: string;
  scopeId: string;
  override?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamResponse {
  success: boolean;
  data: Team;
  status: number;
}

export interface TeamState {
  teams: Team[];
  team: Team | null;
  teamMembers: TeamMembers[];
  isLoading: boolean;
  setTeams: (teams: Team[]) => void;
  setTeamMembers: (teamMembers: TeamMembers[]) => void;
  setTeam: (team: Team | null) => void;
  setLoading: (isLoading: boolean) => void;
}
