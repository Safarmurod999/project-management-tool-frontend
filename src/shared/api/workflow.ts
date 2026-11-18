import type {
  ApiResponse,
  PaginatedResponse,
  Workflow,
  WorkflowDetails,
} from "@/entities/board";
import type {
  AddWorkflowStatusFormData,
  CreateWorkflowFormData,
  UpdateWorkflowFormData,
  UpdateWorkflowTransitionFormData,
  WorkflowTransitionFormData,
} from "@/features/board/model/schema";
import { apiClient } from "./client";

export interface WorkflowFilters {
  projectId: string;
  page?: number;
  limit?: number;
  name?: string;
}

export const workflowApi = {
  create: async (
    data: CreateWorkflowFormData,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.post<ApiResponse<WorkflowDetails>>(
      "/workflows",
      data,
    );
    return response.data;
  },

  /** Workflows without their statuses and transitions */
  getAll: async (
    params: WorkflowFilters,
  ): Promise<PaginatedResponse<Workflow>> => {
    const response = await apiClient.get<PaginatedResponse<Workflow>>(
      "/workflows",
      { params },
    );
    return response.data;
  },

  /** The project's default workflow; 404 when the project has none */
  getDefault: async (
    projectId: string,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.get<ApiResponse<WorkflowDetails>>(
      "/workflows/default",
      { params: { projectId } },
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.get<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}`,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateWorkflowFormData,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.put<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workflows/${id}`);
  },

  addStatus: async (
    id: string,
    data: AddWorkflowStatusFormData,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.post<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}/statuses`,
      data,
    );
    return response.data;
  },

  /** Also removes every transition that starts or ends at the status */
  removeStatus: async (
    id: string,
    statusId: string,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.delete<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}/statuses/${statusId}`,
    );
    return response.data;
  },

  createTransition: async (
    id: string,
    data: WorkflowTransitionFormData,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.post<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}/transitions`,
      data,
    );
    return response.data;
  },

  updateTransition: async (
    id: string,
    transitionId: string,
    data: UpdateWorkflowTransitionFormData,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.put<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}/transitions/${transitionId}`,
      data,
    );
    return response.data;
  },

  deleteTransition: async (
    id: string,
    transitionId: string,
  ): Promise<ApiResponse<WorkflowDetails>> => {
    const response = await apiClient.delete<ApiResponse<WorkflowDetails>>(
      `/workflows/${id}/transitions/${transitionId}`,
    );
    return response.data;
  },
};
