export type NotificationType =
  | "card_assigned"
  | "card_status_changed"
  | "membership_added";

/** Related ids; which ones are present depends on the notification type */
export interface NotificationData {
  cardId?: string;
  columnId?: string;
  boardId?: string;
  projectId?: string;
  teamId?: string;
  scopeType?: "team" | "project" | "board";
  fromStatusId?: string;
  toStatusId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  readAt: string | null;
  createdAt: string;
}

/** GET /notifications: a page of notifications plus the overall unread count */
export interface NotificationsResponse {
  status: number;
  data: Notification[];
  totalCount: number;
  page: number;
  limit: number;
  unreadCount: number;
}
