import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Home,
  LayoutGrid,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/shared/ui';
import { useAuthStore } from '@/entities/user';
import type { Project } from '@/entities/project';
import { CreateProjectForm, useProjects } from '@/features/project';
import { MyStats, MyTasks, type TaskTab } from '@/features/dashboard';

const RECENT_PROJECTS_LIMIT = 6;

type ProjectWithOwnership = Project & { isOwner: boolean };

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Shared by the stats and tasks blocks
  const [projectId, setProjectId] = useState<string | null>(null);
  const [taskTab, setTaskTab] = useState<TaskTab>('open');
  const tasksRef = useRef<HTMLDivElement>(null);

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  // Own and participated projects without duplicates, newest activity first
  const allProjects = useMemo<ProjectWithOwnership[]>(() => {
    if (!projects) return [];

    const all = [
      ...projects.myProjects.map((p) => ({ ...p, isOwner: true })),
      ...projects.participatedProjects.map((p) => ({ ...p, isOwner: false })),
    ];
    const unique = Array.from(new Map(all.map((p) => [p.id, p])).values());

    const timeOf = (p: Project) =>
      new Date(p.updatedAt || p.createdAt).getTime() || 0;
    return unique.sort((a, b) => timeOf(b) - timeOf(a));
  }, [projects]);

  const recentProjects = allProjects.slice(0, RECENT_PROJECTS_LIMIT);

  const handleSelectTab = (tab: TaskTab) => {
    setTaskTab(tab);
    tasksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[{ label: 'Asosiy' }]}
        title={user?.name ? `Xush kelibsiz, ${user.name}` : 'Asosiy Sahifa'}
        description="Sizning loyihalar, vazifalar va aktivliklaringiz"
        icon={<Home size={22} />}
        rightSection={
          <Button
            leftSection={<Plus size={16} />}
            variant="filled"
            color="brand"
            onClick={() => setCreateModalOpen(true)}
          >
            Yangi Loyiha
          </Button>
        }
      />

      <Stack gap="lg">
        <Group justify="flex-end">
          <Select
            placeholder="Barcha loyihalar"
            data={allProjects.map((p) => ({ value: p.id, label: p.name }))}
            value={projectId}
            onChange={setProjectId}
            clearable
            searchable
            disabled={projectsLoading}
            nothingFoundMessage="Loyiha topilmadi"
            w={{ base: '100%', sm: 260 }}
          />
        </Group>

        <MyStats
          projectId={projectId ?? undefined}
          onSelectTab={handleSelectTab}
        />

        <div ref={tasksRef} style={{ scrollMarginTop: 80 }}>
          <MyTasks
            projectId={projectId ?? undefined}
            tab={taskTab}
            onTabChange={setTaskTab}
          />
        </div>

        <Card withBorder padding="lg" radius="lg">
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between" align="center">
              <div>
                <Group gap={8}>
                  <BarChart3 size={20} color="var(--mantine-color-brand-6)" />
                  <Title order={3} size={16}>
                    Sizning loyihalaringiz
                  </Title>
                </Group>
                <Text c="dimmed" size="sm">
                  Hamkasblar bilan ishlayotgan loyihalar
                </Text>
              </div>
              <Button
                leftSection={<LayoutGrid size={16} />}
                variant="subtle"
                color="brand"
                size="xs"
                onClick={() => navigate('/projects')}
              >
                Barchasi
              </Button>
            </Group>
          </Card.Section>

          {projectsLoading ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} pt="md">
              {['a', 'b', 'c'].map((key) => (
                <Skeleton key={key} height={110} radius="md" />
              ))}
            </SimpleGrid>
          ) : projectsError ? (
            <Alert
              mt="md"
              color="red"
              icon={<AlertCircle size={16} />}
              title="Loyihalarni yuklashda xatolik"
            >
              <Button size="xs" variant="light" color="red" onClick={() => refetchProjects()}>
                Qayta urinish
              </Button>
            </Alert>
          ) : recentProjects.length === 0 ? (
            <Text c="dimmed" size="sm" py="lg">
              Hozircha loyiha mavjud emas. Yangi loyiha yaratish uchun yuqoridagi tugmani bosing.
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} pt="md">
              {recentProjects.map((project) => (
                <Card
                  key={project.id}
                  withBorder
                  padding="md"
                  radius="md"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/projects/view/${project.id}`)}
                >
                  <Group justify="space-between" mb={6} wrap="nowrap">
                    <Text fw={600} truncate>
                      {project.name}
                    </Text>
                    <Badge size="sm" color={project.status === 'active' ? 'green' : 'gray'}>
                      {project.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed" lineClamp={2} mb="sm" mih={40}>
                    {project.description || 'Tavsif mavjud emas'}
                  </Text>
                  <Group justify="space-between">
                    <Badge size="xs" variant="light" color={project.isOwner ? 'brand' : 'teal'}>
                      {project.isOwner ? 'Egasi' : 'Ishtirokchi'}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {new Date(project.createdAt).toLocaleDateString('uz-UZ')}
                    </Text>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Card>

        <Card withBorder padding="lg" radius="lg">
          <Group gap="md" wrap="nowrap">
            <BookOpen size={32} color="var(--mantine-color-brand-6)" />
            <div>
              <Title order={4} mb={4}>
                Qo'llanma va Resurslar
              </Title>
              <Text c="dimmed" size="sm">
                Loyihani boshqarish uchun foydali havola va hujjatlar
              </Text>
            </div>
          </Group>
        </Card>
      </Stack>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Yangi loyiha yaratish"
        size="md"
      >
        <CreateProjectForm onSuccess={() => setCreateModalOpen(false)} />
      </Modal>
    </Container>
  );
}
