import { useState } from 'react';
import { ActionIcon, Avatar, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useParams } from 'react-router';
import { TrashIcon } from 'lucide-react';
import { notifications } from '@mantine/notifications';

import styles from './team-view.module.scss';

import { useTeamMembers } from '../model/use-team';
import { useMembershipDelete } from '@/features/membership';

export function TeamView() {
  const { id } = useParams();

  const { data, isFetched } = useTeamMembers(id!);
  const { mutate: deleteTeamMember, isPending } = useMembershipDelete();

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDelete = (memberId: string, memberName: string) => {
    setSelectedMember({
      id: memberId,
      name: memberName,
    });

    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedMember) {
      return;
    }

    deleteTeamMember(selectedMember.id, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: "A'zo muvaffaqiyatli o'chirildi",
          color: 'green',
        });

        setDeleteModalOpened(false);
        setSelectedMember(null);
      },
      onError: () => {
        notifications.show({
          title: 'Xatolik',
          message: "A'zoni o'chirishda xatolik yuz berdi",
          color: 'red',
        });
      },
    });
  };

  const handleCloseDeleteModal = () => {
    if (isPending) {
      return;
    }

    setDeleteModalOpened(false);
    setSelectedMember(null);
  };

  return (
    <>
      <Modal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        title="A'zoni o'chirish"
        centered
      >
        <Stack gap="md">
          <Text>
            "{selectedMember?.name}"ni jamoa a'zolari ro'yxatidan
            o'chirishni xohlaysizmi?
          </Text>

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={handleCloseDeleteModal}
              disabled={isPending}
            >
              Bekor qilish
            </Button>

            <Button
              color="red"
              onClick={handleConfirmDelete}
              loading={isPending}
            >
              O'chirish
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Stack p={20} className={styles.teamView} bdrs={10}>
        <Group justify="space-between">
          <Text size="xl" fw={600}>
            Jamoa a'zolari
          </Text>
        </Group>

        <DataTable
          withRowBorders
          striped
          highlightOnHover
          loaderType="dots"
          records={data && data.length && isFetched ? data : []}
          columns={[
            {
              accessor: 'name',
              title: "A'zo",
              textAlign: 'left',
              render: (r) => (
                <Group>
                  <Avatar radius="sm" src={''} alt={r.user.name} />

                  <Stack gap="0">
                    <Text fw="600" tt="capitalize">
                      {r.user.name}
                    </Text>

                    <Text>{r.user.email}</Text>
                  </Stack>
                </Group>
              ),
            },
            {
              accessor: 'role.name',
              title: 'Roli',
              textAlign: 'left',
            },
            {
              accessor: 'role.description',
              title: 'Rol tavsifi',
            },
            {
              accessor: '',
              title: 'Amallar',
              render: (record) => (
                <Group>
                  <ActionIcon
                    color="red"
                    onClick={() =>
                      handleDelete(record.id, record.user.name)
                    }
                  >
                    <TrashIcon size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          noRecordsText="Ma'lumotlar topilmadi"
        />
      </Stack>
    </>
  );
}