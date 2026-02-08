import { Container, Title, Text, Group, Card } from '@mantine/core';
import { FolderOpen } from 'lucide-react';

export function ProjectsPage() {
  return (
    <Container size="xl" py="md">
      <Group gap={8}>
        <FolderOpen size={32} color="var(--mantine-color-blue-6)" />
        <Title order={1} size={32} fw={700} mb={4}>
          Loyihalar
        </Title>
      </Group>
      <Text c="dimmed" size="sm" mb="xl">
        Barcha loyihalar va ularning statusi
      </Text>
      
      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
