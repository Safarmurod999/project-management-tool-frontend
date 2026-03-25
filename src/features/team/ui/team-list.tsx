import { Card, Text, Group, Badge, ActionIcon, Menu, Modal, Grid } from '@mantine/core';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useTeams, useTeamDelete } from '../model/use-team';
import { useTeamStore } from '@/entities/team';
import { notifications } from '@mantine/notifications';
import { EditTeamForm } from './edit-team-form';
import { useNavigate } from "react-router-dom";
import styles from './team-list.module.scss';

export function TeamList() {
  const navigate = useNavigate();
  const {data: teams, isLoading} = useTeams();
  const teamsFromStore = useTeamStore((state) => state.teams);
  const {mutate: deleteTeam, isPending: isDeleting} = useTeamDelete();

  const displayTeams = teams || teamsFromStore;

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamValues, setEditingTeamValues] = useState<{
                                                               name: string;
                                                               description: string;
                                                             } | null>(null);

  const handleDelete = (teamId: string, teamName: string) => {
    if (window.confirm(`"${teamName}" jamoasini o'chirishni xohlaysizmi?`)) {
      deleteTeam(teamId, {
        onSuccess: () => {
          notifications.show({
            title: 'Muvaffaqiyatli',
            message: 'Jamoa muvaffaqiyatli o\'chirildi',
            color: 'green',
          });
        },
        onError: () => {
          notifications.show({
            title: 'Xatolik',
            message: 'Jamoani o\'chirishda xatolik yuz berdi',
            color: 'red',
          });
        },
      });
    }
  };

  const handleEditOpen = (teamId: string, name: string, description: string) => {
    setEditingTeamId(teamId);
    setEditingTeamValues({name, description});
  };

  const handleEditClose = () => {
    setEditingTeamId(null);
    setEditingTeamValues(null);
  };

  if (isLoading) {
    return <Text>Yuklanmoqda...</Text>;
  }

  if (!displayTeams || displayTeams.length === 0) {
    return (
      <Card padding="xl" radius="md" withBorder>
        <Text ta="center" c="dimmed">
          Hozircha hech qanday jamoa yo'q
        </Text>
      </Card>
    );
  }

  return (
    <>
      <Grid>
        {displayTeams.map((team) => (
          <Grid.Col key={team.id} span={4}>
            <Card padding="lg" radius="md" withBorder className={styles.card}
                  onClick={() => navigate(`/team/view/${team.id}`)}>
              <Group justify="space-between" mb="xs">
                <Group gap="sm">
                  <Users size={20} color="var(--mantine-color-blue-6)"/>
                  <Text fw={500} size="lg">
                    {team.name}
                  </Text>
                </Group>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal size={16}/>
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<Edit size={14}/>}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOpen(team.id, team.name, team.description)
                      }}
                    >
                      Tahrirlash
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<Trash2 size={14}/>}
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(team.id, team.name)
                      }}
                      disabled={isDeleting}
                    >
                      O'chirish
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Text size="sm" c="dimmed" mb="md">
                {team.description}
              </Text>

              <Group justify="space-between">
                <Badge color={team.status === 'active' ? 'green' : 'gray'}>
                  {team.status === 'active' ? 'Faol' : 'Nofaol'}
                </Badge>
                <Text size="xs" c="dimmed">
                  {new Date(team.createdAt).toLocaleDateString('uz-UZ')}
                </Text>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={Boolean(editingTeamId)}
        onClose={handleEditClose}
        title="Jamoani tahrirlash"
        size="md"
      >
        {editingTeamId && editingTeamValues ? (
          <EditTeamForm
            teamId={editingTeamId}
            initialValues={editingTeamValues}
            onSuccess={handleEditClose}
          />
        ) : null}
      </Modal>
    </>
  );
}
