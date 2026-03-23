import { Container, Card, Text } from '@mantine/core';
import { Settings } from 'lucide-react';
import { PageHeader } from '@/shared/ui';

export function SettingsPage() {
  return (
    <Container size="xl" py="md">
      <PageHeader
        breadcrumbs={[
          { label: 'Asosiy', href: '/' },
          { label: 'Sozlamalar' },
        ]}
        title="Sozlamalar"
        description="Loyiha va account sozlamalari"
        icon={<Settings size={32} color="var(--mantine-color-blue-6)" />}
      />

      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
