import { useAuthStore } from "./store";
import type { User } from "./types";

export interface AccessRule {
  roles: readonly string[];
  permission: string;
}

// Backend RoleCode enum values (lowercase), as returned in /auth/me role.code
const ADMINS = ["super_admin", "admin"] as const;
const MANAGERS = ["super_admin", "admin", "manager"] as const;
const MEMBERS = ["super_admin", "admin", "manager", "user"] as const;

/**
 * Mirrors the backend @Roles/@Permissions guards on board, column, card and
 * status endpoints. Only used to hide/disable UI; the backend still enforces it.
 */
export const Access = {
  BOARD_CREATE: { roles: ADMINS, permission: "board:create" },
  BOARD_EDIT: { roles: ADMINS, permission: "board:edit" },
  BOARD_DELETE: { roles: ADMINS, permission: "board:delete" },
  COLUMN_CREATE: { roles: ADMINS, permission: "column:create" },
  COLUMN_EDIT: { roles: ADMINS, permission: "column:edit" },
  COLUMN_DELETE: { roles: ADMINS, permission: "column:delete" },
  CARD_CREATE: { roles: MANAGERS, permission: "card:create" },
  CARD_EDIT: { roles: MANAGERS, permission: "card:edit" },
  CARD_DELETE: { roles: MANAGERS, permission: "card:delete" },
  STATUS_CREATE: { roles: ADMINS, permission: "status:create" },
  STATUS_EDIT: { roles: ADMINS, permission: "status:edit" },
  STATUS_DELETE: { roles: ADMINS, permission: "status:delete" },
  WORKFLOW_GET: { roles: MEMBERS, permission: "workflow:get" },
  WORKFLOW_CREATE: { roles: ADMINS, permission: "workflow:create" },
  WORKFLOW_EDIT: { roles: ADMINS, permission: "workflow:edit" },
  WORKFLOW_DELETE: { roles: ADMINS, permission: "workflow:delete" },
} satisfies Record<string, AccessRule>;

// Same check as RolesPermissionsGuard: role must match AND permission must be granted
export const hasAccess = (user: User | null, rule: AccessRule): boolean =>
  !!user &&
  rule.roles.includes(user.role.code) &&
  user.permissions.some((permission) => permission.code === rule.permission);

export const useAccess = (rule: AccessRule): boolean =>
  useAuthStore((state) => hasAccess(state.user, rule));
