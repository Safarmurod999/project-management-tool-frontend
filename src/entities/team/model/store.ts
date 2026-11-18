import { create } from "zustand";
import type { Team, TeamMembers, TeamState } from "./types";

export const useTeamStore = create<TeamState>((set) => {
  return {
    teams: [],
    team: null,
    teamMembers: [],
    isLoading: false,
    setTeams: (teams: Team[]) =>
      set(() => ({
        teams,
      })),
    setTeamMembers: (teamMembers: TeamMembers[]) =>
      set(() => ({
        teamMembers,
      })),
    setTeam: (team: Team | null) =>
      set(() => ({
        team,
      })),
    setLoading: (isLoading: boolean) =>
      set(() => ({
        isLoading,
      })),
  };
});
