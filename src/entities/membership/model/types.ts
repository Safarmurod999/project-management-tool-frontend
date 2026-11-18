export type ScopeType = "team" | "project" | "board"

export interface TeamMembership {
  id: string;
  name: string;
  description: string;
  teamId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  scopeType: ScopeType;
  scopeId: string;
  roleId: string;
  override: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipResponse {
  success: boolean;
  status: number;
  data: Membership;
}

export interface MembershipState {
  memberships: Membership[] | null;
  membership: Membership | null;
  setMemberships: (memberships: Membership[]) => void;
  setMembership: (membership: Membership | null) => void;
}
