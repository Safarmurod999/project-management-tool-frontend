import { Container, Title, Text } from '@mantine/core';

export function TeamPage() {
  return (
    <Container size="xl" py="md">
      <Title order={1} size={32} fw={700} mb={4}>
        👥 Jamoa
      </Title>
      <Text c="dimmed" size="sm" mb="xl">
        Jamoaning a'zolari va ularning vazifalariga tayinlanishi
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
