import { Container, Title, Text, Group, Card } from '@mantine/core';
import { Users } from 'lucide-react';

export function TeamPage() {
  return (
    <Container size="xl" py="md">
      <Group gap={8}>
        <Users size={32} color="var(--mantine-color-blue-6)" />
        <Title order={1} size={32} fw={700} mb={4}>
          Jamoa
        </Title>
      </Group>
      <Text c="dimmed" size="sm" mb="xl">
        Jamoaning a'zolari va ularning vazifalariga tayinlanishi
      </Text>
      
      <Card padding="xl" radius="md" withBorder>
        <Text c="dimmed" ta="center">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </Card>
    </Container>
  );
}
