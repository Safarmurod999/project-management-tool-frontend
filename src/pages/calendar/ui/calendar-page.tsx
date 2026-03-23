import { Container, Card, Text } from '@mantine/core';
import { Calendar } from 'lucide-react';
import { PageHeader } from '@/shared/ui';

export function CalendarPage() {
  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[
          { label: 'Asosiy', href: '/' },
          { label: 'Taqvim' },
        ]}
        title="Taqvim"
        description="Loyiha va vazifalar taqvimi"
        icon={<Calendar size={32} color="var(--mantine-color-blue-6)" />}
      />

      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
