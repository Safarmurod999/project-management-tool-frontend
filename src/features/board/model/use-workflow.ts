import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { BoardCard, WorkflowDetails } from "@/entities/board";
import { Access, useAccess } from "@/entities/user";
import { cardApi, type TransitionCardPayload } from "@/shared/api/card";
import { workflowApi } from "@/shared/api/workflow";
import type {
  AddWorkflowStatusFormData,
  CreateWorkflowFormData,
  UpdateWorkflowFormData,
  UpdateWorkflowTransitionFormData,
  WorkflowTransitionFormData,
} from "./schema";
import { boardKeys, refreshAfterRejection } from "./use-board";

// API caps page size at 100
const MAX_LIMIT = 100;

/**
 * Cache writers shared by mutations and socket events. Every workflow write
 * returns the full configuration, so it replaces the cached copy as a whole.
 */
export const workflowCache = {
  upsert: (queryClient: QueryClient, workflow: WorkflowDetails) => {
    queryClient.setQueryData(boardKeys.workflow(workflow.id), workflow);
    queryClient.setQueryData<WorkflowDetails | null>(
      boardKeys.projectWorkflow(workflow.projectId),
      (prev) =>
        workflow.isDefault || prev?.id === workflow.id ? workflow : prev,
    );
    // Promoting a default unsets the previous one, and the list omits configuration
    queryClient.invalidateQueries({
      queryKey: boardKeys.workflows(workflow.projectId),
    });
  },

  remove: (queryClient: QueryClient, projectId: string, id: string) => {
    queryClient.removeQueries({ queryKey: boardKeys.workflow(id) });
    queryClient.invalidateQueries({ queryKey: boardKeys.workflows(projectId) });
    // Only the project's sole workflow can be deleted while it is the default,
    // which leaves the project unrestricted; drop its rules right away
    queryClient.setQueryData<WorkflowDetails | null>(
      boardKeys.projectWorkflow(projectId),
      (prev) => (prev?.id === id ? null : prev),
    );
    queryClient.invalidateQueries({
      queryKey: boardKeys.projectWorkflow(projectId),
    });
  },
};

export const useProjectWorkflows = (projectId: string) => {
  const canRead = useAccess(Access.WORKFLOW_GET);

  return useQuery({
    queryKey: boardKeys.workflows(projectId),
    queryFn: async () => {
      const response = await workflowApi.getAll({
        projectId,
        limit: MAX_LIMIT,
      });
      return response.data;
    },
    enabled: !!projectId && canRead,
  });
};

/**
 * The project's default workflow, which governs all of its cards.
 * `null` means the project has no workflow and card statuses are unrestricted.
 */
export const useProjectWorkflow = (projectId: string) => {
  const canRead = useAccess(Access.WORKFLOW_GET);

  return useQuery({
    queryKey: boardKeys.projectWorkflow(projectId),
    queryFn: async (): Promise<WorkflowDetails | null> => {
      try {
        const response = await workflowApi.getDefault(projectId);
        return response.data;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!projectId && canRead,
  });
};

export const useWorkflow = (id: string) => {
  const canRead = useAccess(Access.WORKFLOW_GET);

  return useQuery({
    queryKey: boardKeys.workflow(id),
    queryFn: async () => {
      const response = await workflowApi.getById(id);
      return response.data;
    },
    enabled: !!id && canRead,
  });
};

export const useWorkflowCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkflowFormData) => workflowApi.create(data),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

export const useWorkflowUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowFormData }) =>
      workflowApi.update(id, data),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

export const useWorkflowDelete = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowApi.delete(id),
    onSuccess: (_, id) => workflowCache.remove(queryClient, projectId, id),
  });
};

export const useWorkflowStatusAdd = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddWorkflowStatusFormData) =>
      workflowApi.addStatus(workflowId, data),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

export const useWorkflowStatusRemove = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statusId: string) =>
      workflowApi.removeStatus(workflowId, statusId),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

export const useWorkflowTransitionCreate = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkflowTransitionFormData) =>
      workflowApi.createTransition(workflowId, data),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

export const useWorkflowTransitionUpdate = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transitionId,
      data,
    }: {
      transitionId: string;
      data: UpdateWorkflowTransitionFormData;
    }) => workflowApi.updateTransition(workflowId, transitionId, data),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

export const useWorkflowTransitionDelete = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transitionId: string) =>
      workflowApi.deleteTransition(workflowId, transitionId),
    onSuccess: (response) => workflowCache.upsert(queryClient, response.data),
  });
};

type CardsByColumn = Record<string, BoardCard[]>;

/**
 * POST /cards/:id/transition; the backend may also move the card to the
 * column holding the new status. The status is shown optimistically, the
 * column change arrives with the refetch.
 */
export const useCardTransition = (boardId: string) => {
  const queryClient = useQueryClient();
  const queryKey = boardKeys.cards(boardId);

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TransitionCardPayload;
      /** Target status, applied to the cache before the request finishes */
      toStatusId: string;
    }) => cardApi.transition(id, data),
    onMutate: async ({ id, toStatusId }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueriesData<CardsByColumn>({ queryKey });

      queryClient.setQueriesData<CardsByColumn>({ queryKey }, (prev) =>
        prev
          ? Object.fromEntries(
              Object.entries(prev).map(([columnId, cards]) => [
                columnId,
                cards.map((card) =>
                  card.id === id ? { ...card, statusId: toStatusId } : card,
                ),
              ]),
            )
          : prev,
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      for (const [key, data] of context?.previous ?? []) {
        queryClient.setQueryData(key, data);
      }
      refreshAfterRejection(queryClient, boardId, error);
    },
    // Returned so the mutation stays pending until fresh cards are fetched
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
