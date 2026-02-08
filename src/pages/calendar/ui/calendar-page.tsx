import { Container, Title, Text, Group, Card } from '@mantine/core';
import { Calendar } from 'lucide-react';

export function CalendarPage() {
  return (
    <Container size="xl" py="md">
      <Group gap={8}>
        <Calendar size={32} color="var(--mantine-color-blue-6)" />
        <Title order={1} size={32} fw={700} mb={4}>
          Taqvim
        </Title>
      </Group>
      <Text c="dimmed" size="sm" mb="xl">
        Loyiha va vazifalar taqvimi
      </Text>
      
      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
