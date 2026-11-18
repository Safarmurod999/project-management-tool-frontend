import type { Project } from "@/entities/project";

export const BoardStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

/** Board lifecycle only; card workflow uses project-level Status records */
export type BoardStatusEnum = (typeof BoardStatus)[keyof typeof BoardStatus];

export interface Board {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  status: BoardStatusEnum;
  version: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface BoardColumn {
  id: string;
  boardId: string;
  name: string;
  order: number;
  version: number;
  createdAt: string;
  updatedAt: string | null;
}

/** Workflow status defined per project (GET /statuses?projectId=) */
export interface Status {
  id: string;
  projectId: string;
  name: string;
  code: string;
  color: string;
  order: number;
  isDefault: boolean;
  version: number;
  createdAt: string;
  updatedAt: string | null;
}

/** Status mapped to a column (GET /columns/:id/statuses) */
export interface ColumnStatus {
  id: string;
  columnId: string;
  statusId: string;
  order: number;
  status: Status;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Project-level rules for which statuses cards may use and which status
 * changes are allowed. Exactly one workflow per project is the default and
 * governs its cards; a project without one is unrestricted.
 */
export interface Workflow {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  version: number;
  createdAt: string;
  updatedAt: string | null;
}

/** One-way rule; a two-way transition is stored as two rules */
export interface WorkflowTransition {
  id: string;
  workflowId: string;
  fromStatusId: string;
  toStatusId: string;
  createdAt: string;
  updatedAt: string | null;
}

/** Full configuration returned by every workflow endpoint except the list */
export interface WorkflowDetails extends Workflow {
  statuses: Status[];
  transitions: WorkflowTransition[];
}

export interface BoardCard {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  order: number;
  statusId: string;
  assigneeId?: string | null;
  assignerId?: string | null;
  points?: number;
  version: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface BoardDetails {
  board: Board;
  project: Project;
}

export interface ApiResponse<T> {
  success?: boolean;
  status: number;
  data: T;
}

export interface PaginatedResponse<T> {
  status: number;
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
}
