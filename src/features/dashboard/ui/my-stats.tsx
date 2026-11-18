import { useEffect } from "react";
import {
  Alert,
  Card,
  ColorSwatch,
  Group,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  ListTodo,
  Star,
  Target,
} from "lucide-react";
import type { TaskTab } from "../model/types";
import { useMyStats } from "../model/use-dashboard";

const NO_STATUS_COLOR = "var(--mantine-color-gray-5)";

interface MyStatsProps {
  projectId?: string;
  /** Opens the tasks list with the matching filter */
  onSelectTab: (tab: TaskTab) => void;
}

export function MyStats({ projectId, onSelectTab }: MyStatsProps) {
  const { data: stats, isLoading, isError } = useMyStats(projectId);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Xatolik",
        message: "Statistikani yuklashda xatolik yuz berdi",
        color: "red",
      });
    }
  }, [isError]);

  const completion =
    stats && stats.assignedCards > 0
      ? Math.round((stats.doneCards / stats.assignedCards) * 100)
      : 0;

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        <StatTile
          label="Jami vazifalar"
          value={stats?.assignedCards}
          icon={<ListTodo size={22} />}
          color="brand"
          loading={isLoading}
          onClick={() => onSelectTab("all")}
        />
        <StatTile
          label="Ochiq"
          value={stats?.openCards}
          icon={<CircleDot size={22} />}
          color="orange"
          loading={isLoading}
          onClick={() => onSelectTab("open")}
        />
        <StatTile
          label="Tugagan"
          value={stats?.doneCards}
          icon={<CheckCircle2 size={22} />}
          color="teal"
          loading={isLoading}
          onClick={() => onSelectTab("done")}
        />
        <StatTile
          label="Ballar"
          value={stats ? `${stats.donePoints} / ${stats.totalPoints}` : undefined}
          icon={<Star size={22} />}
          color="yellow"
          loading={isLoading}
          onClick={() => onSelectTab("done")}
        />
      </SimpleGrid>

      <Card withBorder padding="lg" radius="lg">
        <Group justify="space-between" mb="sm">
          <Group gap={8}>
            <Target size={20} color="var(--mantine-color-brand-6)" />
            <Title order={3} size={16}>
              Mening Statistikam
            </Title>
          </Group>
          {stats ? (
            <Text fw={600}>Bajarilgan: {completion}%</Text>
          ) : null}
        </Group>

        {isLoading ? (
          <Skeleton height={60} radius="md" />
        ) : isError || !stats ? (
          <Alert color="red" icon={<AlertCircle size={16} />}>
            Statistikani yuklab bo'lmadi
          </Alert>
        ) : stats.assignedCards === 0 ? (
          <Text c="dimmed" size="sm">
            Hozircha sizga biriktirilgan vazifa yo'q.
          </Text>
        ) : (
          <Stack gap="sm">
            {/* Parts of the whole: each status's share of the assigned cards, in status order */}
            <Progress.Root size={22} radius="md">
              {stats.byStatus.map((item) => {
                const label = item.name ?? "Statussiz";
                const percent = (item.count / stats.assignedCards) * 100;
                return (
                  <Tooltip
                    key={item.statusId ?? "none"}
                    label={`${label}: ${item.count}`}
                  >
                    <Progress.Section
                      value={percent}
                      color={item.color ?? NO_STATUS_COLOR}
                    >
                      {percent >= 10 ? (
                        <Progress.Label>{item.count}</Progress.Label>
                      ) : null}
                    </Progress.Section>
                  </Tooltip>
                );
              })}
            </Progress.Root>
            <Group gap="md">
              {stats.byStatus.map((item) => (
                <Group key={item.statusId ?? "none"} gap={6}>
                  <ColorSwatch color={item.color ?? NO_STATUS_COLOR} size={12} />
                  <Text size="sm">
                    {item.name ?? "Statussiz"}{" "}
                    <Text span c="dimmed">
                      {item.count}
                    </Text>
                  </Text>
                </Group>
              ))}
            </Group>
          </Stack>
        )}
      </Card>
    </Stack>
  );
}

function StatTile({
  label,
  value,
  icon,
  color,
  loading,
  onClick,
}: {
  label: string;
  value: number | string | undefined;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <UnstyledButton onClick={onClick}>
      <Card withBorder padding="lg" radius="lg">
        <Group justify="space-between" align="center" wrap="nowrap">
          <div>
            <Text c="dimmed" size="sm">
              {label}
            </Text>
            {loading ? (
              <Skeleton height={28} width={48} mt={6} />
            ) : (
              <Text fw={700} size="xl">
                {value ?? "—"}
              </Text>
            )}
          </div>
          <ThemeIcon size={44} radius="md" variant="light" color={color}>
            {icon}
          </ThemeIcon>
        </Group>
      </Card>
    </UnstyledButton>
  );
}
