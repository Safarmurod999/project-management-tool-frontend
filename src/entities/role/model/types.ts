export interface Role {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface RoleResponse {
  success: boolean;
  data: Role;
  status: number;
}

export interface RoleState {
  roles: Role[];
  role: Role | null;
  setRoles: (roles: Role[]) => void;
  setRole: (role: Role | null) => void;
}
