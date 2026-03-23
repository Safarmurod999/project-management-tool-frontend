import { Container, Card, Text } from '@mantine/core';
import { FolderOpen } from 'lucide-react';
import { PageHeader } from '@/shared/ui';

export function ProjectsPage() {
  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[
          { label: 'Asosiy', href: '/' },
          { label: 'Loyihalar' },
        ]}
        title="Loyihalar"
        description="Barcha loyihalar va ularning statusi"
        icon={<FolderOpen size={32} color="var(--mantine-color-blue-6)" />}
      />

      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
