import { create } from "zustand";
import type { Role, RoleState } from "./types";

export const useRoleStore = create<RoleState>((set) => {
  return {
    roles: [],
    role: null,
    roleMembers: [],
    isLoading: false,
    setRoles: (roles: Role[]) =>
      set(() => ({
        roles,
      })),
    setRole: (role: Role | null) =>
      set(() => ({
        role,
      })),
  };
});
