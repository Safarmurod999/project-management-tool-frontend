import { Container, Button, Modal } from '@mantine/core';
import { Users, Plus } from 'lucide-react';
import { useState } from 'react';
import { ProjectList, CreateProjectForm } from '@/features/project';
import { PageHeader } from '@/shared/ui';

export function ProjectPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[
          { label: 'Asosiy', href: '/' },
          { label: 'Loyiha' },
        ]}
        title="Loyiha"
        description="Jamoalaringizni boshqaring va a'zolarini tayinlang"
        icon={<Users size={32} color="var(--mantine-color-blue-6)" />}
        rightSection={
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Yangi loyiha
          </Button>
        }
      />

      <ProjectList />

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
