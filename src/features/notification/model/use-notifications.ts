import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { notifications as toast } from "@mantine/notifications";
import type { Notification } from "@/entities/notification";
import { notificationApi } from "@/shared/api/notification";
import { getSocket } from "@/shared/api/socket";

const PAGE_SIZE = 20;

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: ["notifications", "list"] as const,
  list: (unreadOnly: boolean) =>
    ["notifications", "list", { unreadOnly }] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

/** Paged list for the bell panel; the next page loads on scroll */
export const useNotifications = (unreadOnly: boolean, enabled = true) =>
  useInfiniteQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: ({ pageParam }) =>
      notificationApi.getAll({
        page: pageParam,
        limit: PAGE_SIZE,
        unread: unreadOnly || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page * last.limit < last.totalCount ? last.page + 1 : undefined,
    enabled,
  });

/** Unread badge: one tiny request on load, then kept current by the socket */
export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: async () => (await notificationApi.getAll({ limit: 1 })).unreadCount,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.setQueryData(notificationKeys.unreadCount, 0);
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists });
    },
  });
};

/**
 * The backend joins every socket to its `user:<id>` room on connect, so
 * listening is enough. Mount once, inside the authenticated layout.
 */
export const useNotificationsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (notification: Notification) => {
      queryClient.setQueryData<number>(
        notificationKeys.unreadCount,
        (count) => (count ?? 0) + 1,
      );
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists });
      // Assignments and status changes alter the user's cards and stats
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      toast.show({
        title: notification.title,
        message: notification.message,
        color: "brand",
      });
    };

    // Events may have been missed while disconnected, so resync on every (re)connect
    const handleConnect = () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });

    socket.on("notification:created", handleCreated);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("notification:created", handleCreated);
      socket.off("connect", handleConnect);
    };
  }, [queryClient]);
};
