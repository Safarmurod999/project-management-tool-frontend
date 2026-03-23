import { Container, Button, Modal } from '@mantine/core';
import { Users, Plus } from 'lucide-react';
import { useState } from 'react';
import { TeamList, CreateTeamForm } from '@/features/team';
import { PageHeader } from '@/shared/ui';

export function TeamPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[
          { label: 'Asosiy', href: '/' },
          { label: 'Jamoa' },
        ]}
        title="Jamoa"
        description="Jamoalaringizni boshqaring va a'zolarini tayinlang"
        icon={<Users size={32} color="var(--mantine-color-blue-6)" />}
        rightSection={
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Yangi jamoa
          </Button>
        }
      />

      <TeamList />

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Yangi jamoa yaratish"
        size="md"
      >
        <CreateTeamForm onSuccess={() => setCreateModalOpen(false)} />
      </Modal>
    </Container>
  );
}
