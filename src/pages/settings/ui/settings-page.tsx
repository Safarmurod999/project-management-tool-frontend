import { Container, Title, Text } from '@mantine/core';

export function SettingsPage() {
  return (
    <Container size="xl" py="md">
      <Title order={1} size={32} fw={700} mb={4}>
        ⚙️ Sozlamalar
      </Title>
      <Text c="dimmed" size="sm" mb="xl">
        Loyiha va account sozlamalari
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
