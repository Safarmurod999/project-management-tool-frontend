import { create } from "zustand";
import type { Membership, MembershipState } from "./types";

export const useMembershipStore = create<MembershipState>((set) => {
  return {
    memberships: [],
    membership: null,
    isLoading: false,
    setMemberships: (memberships: Membership[]) =>
      set(() => ({
        memberships,
      })),
    setMembership: (membership: Membership | null) =>
      set(() => ({
        membership,
      })),
  };
});
