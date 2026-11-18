import {
  type QueryClient,
  queryOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  BoardCard,
  BoardColumn,
  ColumnStatus,
  Status,
} from "@/entities/board";
import { boardApi } from "@/shared/api/board";
import { cardApi, type ReorderCardPayload } from "@/shared/api/card";
import { columnApi } from "@/shared/api/column";
import { statusApi } from "@/shared/api/status";
import { isRejectionError } from "./get-error-message";
import type {
  AddColumnStatusFormData,
  CreateBoardFormData,
  CreateCardFormData,
  CreateColumnFormData,
  CreateStatusFormData,
  UpdateStatusFormData,
  UpdateBoardFormData,
  UpdateCardFormData,
  UpdateColumnFormData,
} from "./schema";

// API caps page size at 100
const MAX_LIMIT = 100;

export const boardKeys = {
  list: (projectId: string) => ["boards", projectId] as const,
  details: (id: string) => ["board-details", id] as const,
  columns: (boardId: string) => ["columns", boardId] as const,
  cards: (boardId: string) => ["board-cards", boardId] as const,
  statuses: (projectId: string) => ["statuses", projectId] as const,
  columnStatuses: (columnId: string) => ["column-statuses", columnId] as const,
  // Shared "workflows" prefix so status changes can refresh them all at once
  workflows: (projectId: string) => ["workflows", "list", projectId] as const,
  projectWorkflow: (projectId: string) =>
    ["workflows", "default", projectId] as const,
  workflow: (id: string) => ["workflows", "detail", id] as const,
};

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

// Boards

export const useBoards = (projectId: string) => {
  return useQuery({
    queryKey: boardKeys.list(projectId),
    queryFn: async () => {
      const response = await boardApi.getAll({ projectId, limit: MAX_LIMIT });
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useBoardDetails = (id: string) => {
  return useQuery({
    queryKey: boardKeys.details(id),
    queryFn: async () => {
      const response = await boardApi.getDetails(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useBoardCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardFormData) => boardApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.list(response.data.projectId),
      });
    },
  });
};

export const useBoardUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardFormData }) =>
      boardApi.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.list(response.data.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.details(response.data.id),
      });
    },
  });
};

export const useBoardDelete = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.list(projectId) });
    },
  });
};

// Columns

export const useColumns = (boardId: string) => {
  return useQuery({
    queryKey: boardKeys.columns(boardId),
    queryFn: async (): Promise<BoardColumn[]> => {
      const response = await columnApi.getAll({ boardId, limit: MAX_LIMIT });
      return [...response.data].sort(byOrder);
    },
    enabled: !!boardId,
  });
};

export const useColumnCreate = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnFormData) => columnApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.columns(boardId) });
    },
  });
};

export const useColumnUpdate = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnFormData }) =>
      columnApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.columns(boardId) });
    },
  });
};

export const useColumnDelete = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => columnApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.columns(boardId) });
      queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId) });
    },
  });
};

// Statuses

export const useProjectStatuses = (projectId: string) => {
  return useQuery({
    queryKey: boardKeys.statuses(projectId),
    queryFn: async (): Promise<Status[]> => {
      const response = await statusApi.getAll({ projectId, limit: MAX_LIMIT });
      return [...response.data].sort(byOrder);
    },
    enabled: !!projectId,
  });
};

const columnStatusesQuery = (columnId: string) =>
  queryOptions({
    queryKey: boardKeys.columnStatuses(columnId),
    queryFn: async (): Promise<ColumnStatus[]> => {
      const response = await columnApi.getStatuses(columnId);
      return [...response.data].sort(byOrder);
    },
    enabled: !!columnId,
  });

/**
 * Cache writers shared by mutations and socket events. Both apply the same
 * change idempotently (by id), so a mutation result followed by its own
 * socket echo doesn't duplicate anything.
 */
export const statusCache = {
  upsert: (queryClient: QueryClient, status: Status) => {
    queryClient.setQueryData<Status[]>(
      boardKeys.statuses(status.projectId),
      (prev) =>
        prev
          ? [...prev.filter((item) => item.id !== status.id), status].sort(
              byOrder,
            )
          : prev,
    );
    // Column mappings and workflows embed the status, so refresh them to pick up name/color
    queryClient.invalidateQueries({ queryKey: ["column-statuses"] });
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
  },

  remove: (queryClient: QueryClient, projectId: string, statusId: string) => {
    queryClient.setQueryData<Status[]>(boardKeys.statuses(projectId), (prev) =>
      prev?.filter((item) => item.id !== statusId),
    );
    // Deleting a status also deletes its column mappings and workflow entries
    queryClient.invalidateQueries({ queryKey: ["column-statuses"] });
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
  },
};

export const useStatusCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStatusFormData) => statusApi.create(data),
    onSuccess: (response) => {
      // Creating a default status clears the previous default server-side
      if (response.data.isDefault) {
        queryClient.invalidateQueries({
          queryKey: boardKeys.statuses(response.data.projectId),
        });
      }
      statusCache.upsert(queryClient, response.data);
    },
  });
};

export const useStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusFormData }) =>
      statusApi.update(id, data),
    onSuccess: (response) => {
      if (response.data.isDefault) {
        queryClient.invalidateQueries({
          queryKey: boardKeys.statuses(response.data.projectId),
        });
      }
      statusCache.upsert(queryClient, response.data);
    },
  });
};

export const useStatusDelete = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => statusApi.delete(id),
    onSuccess: (_, id) => statusCache.remove(queryClient, projectId, id),
  });
};

/**
 * There is no bulk reorder endpoint, so each status whose position changed is
 * updated via PUT /statuses/:id. The list is reordered optimistically and
 * rolled back if any request fails.
 */
export const useStatusReorder = (projectId: string) => {
  const queryClient = useQueryClient();
  const queryKey = boardKeys.statuses(projectId);

  return useMutation({
    mutationFn: async (ordered: Status[]) => {
      for (const [order, status] of ordered.entries()) {
        if (status.order !== order) {
          await statusApi.update(status.id, { order });
        }
      }
    },
    onMutate: async (ordered) => {
      const previous = queryClient.getQueryData<Status[]>(queryKey);
      // Applied before awaiting so the dropped row doesn't flicker back
      queryClient.setQueryData<Status[]>(
        queryKey,
        ordered.map((status, order) => ({ ...status, order })),
      );
      await queryClient.cancelQueries({ queryKey });
      return { previous };
    },
    onError: (_error, _ordered, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};

export const useColumnStatuses = (columnId: string) => {
  return useQuery(columnStatusesQuery(columnId));
};

/**
 * Status mappings of every column on a board, grouped by column id.
 * A column is undefined until its mappings have loaded.
 * Shares the per-column cache with useColumnStatuses.
 */
export const useBoardColumnStatuses = (columns?: BoardColumn[]) => {
  const columnIds = columns?.map((column) => column.id) ?? [];

  return useQueries({
    queries: columnIds.map(columnStatusesQuery),
    combine: (results): Record<string, ColumnStatus[] | undefined> =>
      Object.fromEntries(
        columnIds.map((columnId, index) => [columnId, results[index].data]),
      ),
  });
};

export const useColumnStatusAdd = (columnId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddColumnStatusFormData) =>
      columnApi.addStatus(columnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.columnStatuses(columnId),
      });
    },
  });
};

export const useColumnStatusRemove = (columnId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statusId: string) => columnApi.removeStatus(columnId, statusId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.columnStatuses(columnId),
      });
    },
  });
};

// Cards

/**
 * GET /cards is scoped to a single column, so the board's cards are
 * fetched per column in parallel and grouped by column id.
 */
export const useBoardCards = (boardId: string, columns?: BoardColumn[]) => {
  const columnIds = columns?.map((column) => column.id) ?? [];

  return useQuery({
    queryKey: [...boardKeys.cards(boardId), columnIds],
    queryFn: async (): Promise<Record<string, BoardCard[]>> => {
      const entries = await Promise.all(
        columnIds.map(async (columnId) => {
          const response = await cardApi.getAll({
            columnId,
            limit: MAX_LIMIT,
          });
          return [columnId, [...response.data].sort(byOrder)] as const;
        }),
      );

      return Object.fromEntries(entries);
    },
    enabled: !!boardId && !!columns,
  });
};

export const useCardCreate = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardFormData) => cardApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId) });
    },
  });
};

/**
 * The backend is the authority on workflow rules: when it rejects a status
 * change, reload the rules, column mappings and cards so the UI offers what
 * it really allows.
 */
export const refreshAfterRejection = (
  queryClient: QueryClient,
  boardId: string,
  error: unknown,
) => {
  if (isRejectionError(error)) {
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
    // Prefix of every column's mappings
    queryClient.invalidateQueries({ queryKey: ["column-statuses"] });
    queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId) });
  }
};

export const useCardUpdate = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardFormData }) =>
      cardApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId) });
    },
    onError: (error) => refreshAfterRejection(queryClient, boardId, error),
  });
};

export const useCardReorder = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderCardPayload) => cardApi.reorder(data),
    // Cards are refetched in onSettled anyway; this also refreshes the rules
    onError: (error) => refreshAfterRejection(queryClient, boardId, error),
    // Returned so the mutation stays pending until fresh cards are fetched
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId) }),
  });
};

export const useCardDelete = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId) });
    },
  });
};
