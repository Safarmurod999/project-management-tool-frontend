import {
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

import {
  Activity,
  CheckCircle2,
  KanbanSquare,
  ListTodo,
  Users,
} from "lucide-react";

export function ProjectView() {
  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <ProjectStat
          label="A'zolar"
          value="12"
          icon={<Users size={20} />}
        />

        <ProjectStat
          label="Boardlar"
          value="4"
          icon={<KanbanSquare size={20} />}
        />

        <ProjectStat
          label="Vazifalar"
          value="84"
          icon={<ListTodo size={20} />}
        />

        <ProjectStat
          label="Bajarilgan"
          value="37"
          icon={<CheckCircle2 size={20} />}
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder radius="md" p="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>So'nggi boardlar</Text>

                <KanbanSquare size={18} />
              </Group>

              <Stack gap="xs">
                <BoardItem
                  name="Development"
                  members={8}
                  tasks={24}
                />

                <BoardItem
                  name="Design"
                  members={4}
                  tasks={12}
                />

                <BoardItem
                  name="Mobile App"
                  members={6}
                  tasks={18}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="md" p="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>So'nggi faoliyat</Text>

                <Activity size={18} />
              </Group>

              <Stack gap="md">
                <ActivityItem
                  text='John Doe "Development" boardini yaratdi'
                  date="2 daqiqa oldin"
                />

                <ActivityItem
                  text="Jane Smith projectga qo'shildi"
                  date="1 soat oldin"
                />

                <ActivityItem
                  text="Alex Brown project statusini o'zgartirdi"
                  date="Kecha"
                />
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function ProjectStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card withBorder radius="md" p="md">
      <Group>
        <ThemeIcon
          variant="light"
          size="lg"
          radius="md"
        >
          {icon}
        </ThemeIcon>

        <Stack gap={0}>
          <Text size="sm" c="dimmed">
            {label}
          </Text>

          <Text size="xl" fw={700}>
            {value}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

function BoardItem({
  name,
  members,
  tasks,
}: {
  name: string;
  members: number;
  tasks: number;
}) {
  return (
    <Card withBorder radius="sm" p="sm">
      <Group justify="space-between">
        <Text fw={500}>{name}</Text>

        <Group gap="md">
          <Text size="sm" c="dimmed">
            {members} a'zo
          </Text>

          <Text size="sm" c="dimmed">
            {tasks} vazifa
          </Text>
        </Group>
      </Group>
    </Card>
  );
}

function ActivityItem({
  text,
  date,
}: {
  text: string;
  date: string;
}) {
  return (
    <Stack gap={2}>
      <Text size="sm">{text}</Text>

      <Text size="xs" c="dimmed">
        {date}
      </Text>
    </Stack>
  );
}