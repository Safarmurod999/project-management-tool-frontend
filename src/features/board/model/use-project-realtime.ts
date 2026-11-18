import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Board, Status, WorkflowDetails } from "@/entities/board";
import { getSocket } from "@/shared/api/socket";
import { boardKeys, statusCache } from "./use-board";
import { workflowCache } from "./use-workflow";

/**
 * Subscribes to the backend's `project:<id>` room and applies its events to
 * the query cache. The backend currently emits status, workflow and
 * board-creation events only; columns, column-status mappings and cards are
 * kept fresh by their mutations' cache invalidation.
 */
export const useProjectRealtime = (projectId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const socket = getSocket();

    // Rooms are lost on reconnect, so join again every time the socket connects
    const joinProject = () => socket.emit("project:join", projectId);

    const handleStatusUpsert = (status: Status) => {
      if (status.projectId === projectId) {
        statusCache.upsert(queryClient, status);
      }
    };

    const handleStatusDeleted = (payload: {
      id: string;
      projectId: string;
    }) => {
      if (payload.projectId === projectId) {
        statusCache.remove(queryClient, projectId, payload.id);
      }
    };

    const handleBoardCreated = (board: Board) => {
      if (board.projectId === projectId) {
        queryClient.invalidateQueries({ queryKey: boardKeys.list(projectId) });
      }
    };

    const handleWorkflowUpsert = (workflow: WorkflowDetails) => {
      if (workflow.projectId === projectId) {
        workflowCache.upsert(queryClient, workflow);
      }
    };

    const handleWorkflowDeleted = (payload: {
      id: string;
      projectId: string;
    }) => {
      if (payload.projectId === projectId) {
        workflowCache.remove(queryClient, projectId, payload.id);
      }
    };

    if (socket.connected) {
      joinProject();
    }

    socket.on("connect", joinProject);
    socket.on("status:created", handleStatusUpsert);
    socket.on("status:updated", handleStatusUpsert);
    socket.on("status:deleted", handleStatusDeleted);
    socket.on("board:created", handleBoardCreated);
    socket.on("workflow:created", handleWorkflowUpsert);
    socket.on("workflow:updated", handleWorkflowUpsert);
    socket.on("workflow:deleted", handleWorkflowDeleted);

    // Removing only this hook's handlers keeps listeners from piling up
    return () => {
      socket.off("connect", joinProject);
      socket.off("status:created", handleStatusUpsert);
      socket.off("status:updated", handleStatusUpsert);
      socket.off("status:deleted", handleStatusDeleted);
      socket.off("board:created", handleBoardCreated);
      socket.off("workflow:created", handleWorkflowUpsert);
      socket.off("workflow:updated", handleWorkflowUpsert);
      socket.off("workflow:deleted", handleWorkflowDeleted);
    };
  }, [projectId, queryClient]);
};
