import { Container, Title, Text } from '@mantine/core';

export function ProjectsPage() {
  return (
    <Container size="xl" py="md">
      <Title order={1} size={32} fw={700} mb={4}>
        📁 Loyihalar
      </Title>
      <Text c="dimmed" size="sm" mb="xl">
        Barcha loyihalar va ularning statusi
      </Text>
      
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f6f8fa',
        borderRadius: '8px',
      }}>
        <Text c="dimmed">Bu sahifa kelajakda tayyorlanmoqda...</Text>
      </div>
    </Container>
  );
}
