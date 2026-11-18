import { useState } from 'react';

import { Container, Group, Button } from '@mantine/core';

import { SettingsIcon, Users } from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';

import { MemberModal, PageHeader } from '@/shared/ui';

import { TeamView, useTeam } from '@/features/team';

export function TeamViewPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { data, isFetched } = useTeam(id!);

  const handleAddMember = () => {
    setOpen(true);
  };

  const handleCloseMemberModal = (value: boolean) => {
    setOpen(value);
  };

  return (
    <Container size="xl" py="md">
      {isFetched && data && (
        <PageHeader
          breadcrumbs={[
            {
              label: 'Asosiy',
              href: '/',
            },
            {
              label: 'Jamoa',
            },
            {
              label: data.name,
            },
          ]}
          title={data.name}
          description={data.description}
          icon={
            <Users
              size={22}
            />
          }
          rightSection={
            <Group>
              <Button
                leftSection={<Users size={16} />}
                onClick={handleAddMember}
              >
                Yangi a'zo qo'shish
              </Button>

              <Button
                leftSection={<SettingsIcon size={16} />}
                onClick={() =>
                  navigate(`/team/view/${id}/permissions`)
                }
              >
                Ruxsatlarni boshqarish
              </Button>
            </Group>
          }
        />
      )}

      <TeamView
      />

      <MemberModal
        open={open}
        setOpen={handleCloseMemberModal}
        scopeType="team"
      />
    </Container>
  );
}