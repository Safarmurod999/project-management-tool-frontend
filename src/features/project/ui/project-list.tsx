import { Card, Text, Group, Badge, ActionIcon, Menu, Modal, Grid, Tabs } from '@mantine/core';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useProjects, useProjectDelete } from '../model/use-project';
import { useProjectStore } from '@/entities/project';
import { notifications } from '@mantine/notifications';
import { EditProjectForm } from './edit-project-form';
import { useNavigate } from "react-router-dom";
import styles from './project-list.module.scss';

export function ProjectList() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const projectsFromStore = useProjectStore((state) => state.projects);
  const { mutate: deleteProject, isPending: isDeleting } = useProjectDelete();

  const displayProjects = projects || projectsFromStore;

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectValues, setEditingProjectValues] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const handleDelete = (projectId: string, projectName: string) => {
    if (window.confirm(`"${projectName}" loyihasini o'chirishni xohlaysizmi?`)) {
      deleteProject(projectId, {
        onSuccess: () => {
          notifications.show({
            title: 'Muvaffaqiyatli',
            message: 'Loyiha muvaffaqiyatli o\'chirildi',
            color: 'green',
          });
        },
        onError: () => {
          notifications.show({
            title: 'Xatolik',
            message: 'Loyihani o\'chirishda xatolik yuz berdi',
            color: 'red',
          });
        },
      });
    }
  };

  const handleEditOpen = (projectId: string, name: string, description: string) => {
    setEditingProjectId(projectId);
    setEditingProjectValues({ name, description });
  };

  const handleEditClose = () => {
    setEditingProjectId(null);
    setEditingProjectValues(null);
  };

  if (isLoading) {
    return <Text>Yuklanmoqda...</Text>;
  }

  return (
    <>
      <Tabs defaultValue="my-projects" mb="md">
        <Tabs.List>
          <Tabs.Tab value="my-projects">Mening loyihalarim</Tabs.Tab>
          <Tabs.Tab value="participated-projects">Ishtirok etayotgan loyihalar</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="my-projects" pt="xs">
          <Grid>
            {
              displayProjects && displayProjects?.myProjects.length > 0 ?
                displayProjects.myProjects.map((project) => (
                  <Grid.Col key={project.id} span={4}>
                    <Card padding="lg" radius="md" withBorder className={styles.card}
                      onClick={() => navigate(`/projects/view/${project.id}`)}>
                      <Group justify="space-between" mb="xs">
                        <Group gap="sm">
                          <Users size={20} color="var(--mantine-color-blue-6)" />
                          <Text fw={500} size="lg">
                            {project.name}
                          </Text>
                        </Group>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<Edit size={14} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOpen(project.id, project.name, project.description)
                              }}
                            >
                              Tahrirlash
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<Trash2 size={14} />}
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(project.id, project.name)
                              }}
                              disabled={isDeleting}
                            >
                              O'chirish
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      <Text size="sm" c="dimmed" mb="md">
                        {project.description}
                      </Text>

                      <Group justify="space-between">
                        <Badge color={project.status === 'active' ? 'green' : 'gray'}>
                          {project.status === 'active' ? 'Faol' : 'Nofaol'}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {new Date(project.createdAt).toLocaleDateString('uz-UZ')}
                        </Text>
                      </Group>
                    </Card>
                  </Grid.Col>
                )) :
                <Grid.Col span={12}>
                  <Card padding="xl" radius="md" withBorder>
                    <Text ta="center" c="dimmed">
                      Hozircha hech qanday loyiha yo'q
                    </Text>
                  </Card>
                </Grid.Col>
            }
          </Grid>
        </Tabs.Panel>
        <Tabs.Panel value="participated-projects" pt="xs">
          <Grid>
            {
              displayProjects && displayProjects?.participatedProjects.length > 0 ?
                displayProjects.participatedProjects.map((project) => (
                  <Grid.Col key={project.id} span={4}>
                    <Card padding="lg" radius="md" withBorder className={styles.card}
                      onClick={() => navigate(`/projects/view/${project.id}`)}>
                      <Group justify="space-between" mb="xs">
                        <Group gap="sm">
                          <Users size={20} color="var(--mantine-color-blue-6)" />
                          <Text fw={500} size="lg">
                            {project.name}
                          </Text>
                        </Group>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<Edit size={14} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOpen(project.id, project.name, project.description)
                              }}
                            >
                              Tahrirlash
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<Trash2 size={14} />}
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(project.id, project.name)
                              }}
                              disabled={isDeleting}
                            >
                              O'chirish
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      <Text size="sm" c="dimmed" mb="md">
                        {project.description}
                      </Text>

                      <Group justify="space-between">
                        <Badge color={project.status === 'active' ? 'green' : 'gray'}>
                          {project.status === 'active' ? 'Faol' : 'Nofaol'}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {new Date(project.createdAt).toLocaleDateString('uz-UZ')}
                        </Text>
                      </Group>
                    </Card>
                  </Grid.Col>
                )) :
                <Grid.Col span={12}>
                  <Card padding="xl" radius="md" withBorder>
                    <Text ta="center" c="dimmed">
                      Hozircha hech qanday loyiha yo'q
                    </Text>
                  </Card>
                </Grid.Col>
            }
          </Grid>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={Boolean(editingProjectId)}
        onClose={handleEditClose}
        title="Jamoani tahrirlash"
        size="md"
      >
        {editingProjectId && editingProjectValues ? (
          <EditProjectForm
            projectId={editingProjectId}
            initialValues={editingProjectValues}
            onSuccess={handleEditClose}
          />
        ) : null}
      </Modal>
    </>
  );
}
