import { Container, Title, Text, Group, Card } from '@mantine/core';
import { ListChecks } from 'lucide-react';

export function TasksPage() {
  return (
    <Container size="xl" py="md">
      <Group gap={8}>
        <ListChecks size={32} color="var(--mantine-color-blue-6)" />
        <Title order={1} size={32} fw={700} mb={4}>
          Vazifalar
        </Title>
      </Group>
      <Text c="dimmed" size="sm" mb="xl">
        Barcha vazifalar va ularning o'tkazilishi
      </Text>
      
      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
