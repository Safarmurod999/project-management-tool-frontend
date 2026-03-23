import { Container, Card, Text } from '@mantine/core';
import { ListChecks } from 'lucide-react';
import { PageHeader } from '@/shared/ui';

export function TasksPage() {
  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[
          { label: 'Asosiy', href: '/' },
          { label: 'Vazifalar' },
        ]}
        title="Vazifalar"
        description="Barcha vazifalar va ularning o'tkazilishi"
        icon={<ListChecks size={32} color="var(--mantine-color-blue-6)" />}
      />

      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
