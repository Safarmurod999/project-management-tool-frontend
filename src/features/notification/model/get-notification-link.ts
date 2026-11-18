import type { Notification } from "@/entities/notification";

const boardLink = (boardId: string, cardId?: string) =>
  cardId ? `/boards/${boardId}?card=${cardId}` : `/boards/${boardId}`;

/** Page a notification leads to, from its `data` ids; null when there is none */
export const getNotificationLink = ({
  type,
  data,
}: Notification): string | null => {
  if (type === "card_assigned" || type === "card_status_changed") {
    return data.boardId ? boardLink(data.boardId, data.cardId) : null;
  }

  if (type === "membership_added") {
    if (data.scopeType === "team" && data.teamId) {
      return `/team/view/${data.teamId}`;
    }
    if (data.scopeType === "project" && data.projectId) {
      return `/projects/view/${data.projectId}`;
    }
    if (data.scopeType === "board" && data.boardId) {
      return boardLink(data.boardId);
    }
  }

  // Unknown type or missing scopeType: go to the most specific id available
  if (data.boardId) return boardLink(data.boardId, data.cardId);
  if (data.projectId) return `/projects/view/${data.projectId}`;
  if (data.teamId) return `/team/view/${data.teamId}`;
  return null;
};
