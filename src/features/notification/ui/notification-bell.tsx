import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Indicator,
  Loader,
  Popover,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { notifications as toast } from "@mantine/notifications";
import { Bell, CheckCheck } from "lucide-react";
import type { Notification } from "@/entities/notification";
import { fromNow } from "@/shared/lib";
import { getNotificationLink } from "../model/get-notification-link";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationsRealtime,
  useUnreadCount,
} from "../model/use-notifications";

const MAX_BADGE = 99;

export function NotificationBell() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  useNotificationsRealtime();
  const { data: unreadCount = 0 } = useUnreadCount();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(unreadOnly, opened);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const handleOpen = (notification: Notification) => {
    if (!notification.readAt) {
      markRead(notification.id);
    }

    const link = getNotificationLink(notification);
    if (link) {
      setOpened(false);
      navigate(link);
    }
  };

  const handleMarkAll = () =>
    markAllRead(undefined, {
      onError: () =>
        toast.show({
          title: "Xatolik",
          message: "Bildirishnomalarni yangilab bo'lmadi",
          color: "red",
        }),
    });

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={380}
      position="bottom-end"
      shadow="md"
    >
      <Popover.Target>
        <Indicator
          label={unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : unreadCount}
          size={18}
          color="red"
          disabled={unreadCount === 0}
          offset={4}
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="xl"
            aria-label="Bildirishnomalar"
            onClick={() => setOpened((o) => !o)}
          >
            <Bell size={20} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>

      <Popover.Dropdown p={0}>
        <Group justify="space-between" px="md" py="sm">
          <Text fw={600}>Bildirishnomalar</Text>
          <Button
            variant="subtle"
            size="compact-xs"
            leftSection={<CheckCheck size={14} />}
            disabled={unreadCount === 0}
            loading={isMarkingAll}
            onClick={handleMarkAll}
          >
            Hammasini o'qilgan qilish
          </Button>
        </Group>

        <Box px="md" pb="sm">
          <SegmentedControl
            fullWidth
            size="xs"
            value={unreadOnly ? "unread" : "all"}
            onChange={(value) => setUnreadOnly(value === "unread")}
            data={[
              { label: "Hammasi", value: "all" },
              { label: "Faqat o'qilmaganlar", value: "unread" },
            ]}
          />
        </Box>

        <ScrollArea.Autosize
          mah={420}
          onBottomReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        >
          {isLoading ? (
            <Center py="lg">
              <Loader size="sm" />
            </Center>
          ) : isError ? (
            <Text c="red" size="sm" ta="center" py="lg">
              Bildirishnomalarni yuklashda xatolik
            </Text>
          ) : items.length === 0 ? (
            <Text c="dimmed" size="sm" ta="center" py="lg">
              {unreadOnly ? "O'qilmagan bildirishnoma yo'q" : "Bildirishnoma yo'q"}
            </Text>
          ) : (
            <Stack gap={0}>
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleOpen(notification)}
                />
              ))}
              {isFetchingNextPage ? (
                <Center py="sm">
                  <Loader size="xs" />
                </Center>
              ) : null}
            </Stack>
          )}
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const unread = !notification.readAt;

  return (
    <UnstyledButton
      onClick={onClick}
      px="md"
      py="sm"
      style={{
        borderTop: "1px solid var(--mantine-color-default-border)",
        background: unread ? "var(--mantine-color-brand-light)" : undefined,
      }}
    >
      <Group align="flex-start" gap="sm" wrap="nowrap">
        <Box
          mt={6}
          w={8}
          h={8}
          style={{
            borderRadius: "50%",
            flexShrink: 0,
            background: unread ? "var(--mantine-color-brand-6)" : "transparent",
          }}
        />
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text size="sm" fw={unread ? 600 : 500}>
            {notification.title}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {notification.message}
          </Text>
          <Text size="xs" c="dimmed">
            {fromNow(notification.createdAt)}
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
}
