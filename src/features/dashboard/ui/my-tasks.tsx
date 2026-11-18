import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Skeleton,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import type { MyCard } from "@/entities/board";
import { fromNow } from "@/shared/lib";
import { taskTabToDone, type TaskTab } from "../model/types";
import { useMyCards } from "../model/use-dashboard";

const PAGE_SIZE = 10;
const NO_STATUS_COLOR = "gray";

interface MyTasksProps {
  /** Project filter shared with the stats block; undefined = all projects */
  projectId?: string;
  tab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
}

export function MyTasks({ projectId, tab, onTabChange }: MyTasksProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 300);
  const [page, setPage] = useState(1);

  // Any filter change starts again from the first page
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when filters change
  useEffect(() => {
    setPage(1);
  }, [projectId, tab, debouncedSearch]);

  const { data, isLoading, isFetching, isError, refetch } = useMyCards({
    page,
    limit: PAGE_SIZE,
    projectId,
    title: debouncedSearch || undefined,
    done: taskTabToDone(tab),
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Xatolik",
        message: "Vazifalarni yuklashda xatolik yuz berdi",
        color: "red",
      });
    }
  }, [isError]);

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

  return (
    <Card withBorder padding="lg" radius="lg">
      <Card.Section withBorder inheritPadding py="md">
        <Group justify="space-between" align="center" gap="sm">
          <div>
            <Group gap={8}>
              <CheckCircle2 size={20} color="var(--mantine-color-brand-6)" />
              <Title order={3} size={16}>
                Mening Vazifalarim
              </Title>
              {data ? (
                <Badge variant="light" size="sm">
                  {data.totalCount}
                </Badge>
              ) : null}
            </Group>
            <Text c="dimmed" size="sm">
              Barcha loyihalardagi sizga biriktirilgan vazifalar
            </Text>
          </div>
          <TextInput
            placeholder="Vazifa nomi bo'yicha qidirish"
            leftSection={<Search size={16} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            w={{ base: "100%", sm: 280 }}
          />
        </Group>
      </Card.Section>

      <Tabs
        value={tab}
        onChange={(value) => value && onTabChange(value as TaskTab)}
        mt="md"
      >
        <Tabs.List>
          <Tabs.Tab value="open">Ochiq</Tabs.Tab>
          <Tabs.Tab value="done">Tugagan</Tabs.Tab>
          <Tabs.Tab value="all">Hammasi</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {isLoading ? (
        <Stack gap="xs" pt="md">
          {["a", "b", "c", "d"].map((key) => (
            <Skeleton key={key} height={64} radius="md" />
          ))}
        </Stack>
      ) : isError ? (
        <Alert
          mt="md"
          color="red"
          icon={<AlertCircle size={16} />}
          title="Vazifalarni yuklashda xatolik"
        >
          <Button size="xs" variant="light" color="red" onClick={() => refetch()}>
            Qayta urinish
          </Button>
        </Alert>
      ) : !data || data.data.length === 0 ? (
        <Text c="dimmed" size="sm" py="lg">
          {debouncedSearch
            ? "Qidiruv bo'yicha vazifa topilmadi."
            : "Sizga biriktirilgan vazifalar yo'q."}
        </Text>
      ) : (
        <Stack gap="xs" pt="md" style={{ opacity: isFetching ? 0.6 : 1 }}>
          {data.data.map((card) => (
            <TaskRow key={card.id} card={card} />
          ))}
        </Stack>
      )}

      {totalPages > 1 ? (
        <Group justify="center" mt="md">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      ) : null}
    </Card>
  );
}

function TaskRow({ card }: { card: MyCard }) {
  const navigate = useNavigate();

  return (
    <UnstyledButton
      onClick={() => navigate(`/boards/${card.board.id}?card=${card.id}`)}
    >
      <Card withBorder padding="sm" radius="md">
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Stack gap={4} style={{ minWidth: 0 }}>
            <Text fw={600} truncate>
              {card.title}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {card.project.name} · {card.board.name}
              {card.assigner ? ` · Biriktirdi: ${card.assigner.name}` : ""}
            </Text>
          </Stack>
          <Group gap="xs" wrap="nowrap">
            {card.points ? (
              <Badge size="sm" variant="outline" color="gray">
                {card.points} ball
              </Badge>
            ) : null}
            <Badge
              size="sm"
              color={card.status?.color ?? NO_STATUS_COLOR}
              variant="filled"
            >
              {card.status?.name ?? "Statussiz"}
            </Badge>
            <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
              {fromNow(card.updatedAt ?? card.createdAt)}
            </Text>
          </Group>
        </Group>
      </Card>
    </UnstyledButton>
  );
}
