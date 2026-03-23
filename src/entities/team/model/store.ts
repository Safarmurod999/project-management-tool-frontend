import { create } from "zustand";
import type { Team, TeamState } from "./types";

export const useTeamStore = create<TeamState>((set) => {
  return {
    teams: [],
    team: null,
    isLoading: false,
    setTeams: (teams: Team[]) =>
      set(() => ({
        teams,
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
