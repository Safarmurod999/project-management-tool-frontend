import { Container, Title, Text, Button, Stack, Group, Card } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';

export function HomePage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>Xush kelibsiz!</Title>
          <Text c="dimmed">Project Management Tool</Text>
        </div>
        <Button onClick={handleLogout} variant="light" color="red">
          Chiqish
        </Button>
      </Group>

      <Stack gap="lg">
        <Card withBorder padding="lg" radius="md">
          <Card.Section withBorder inheritPadding py="md">
            <Title order={3}>Loyihalarim</Title>
          </Card.Section>
          <Text c="dimmed" size="sm">
            Loyihalar sahifasi kelajakda tayyorlanmoqda...
          </Text>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Card.Section withBorder inheritPadding py="md">
            <Title order={3}>Mening Vazifalarim</Title>
          </Card.Section>
          <Text c="dimmed" size="sm">
            Vazifalar sahifasi kelajakda tayyorlanmoqda...
          </Text>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Card.Section withBorder inheritPadding py="md">
            <Title order={3}>Oldingi Aktivliklar</Title>
          </Card.Section>
          <Text c="dimmed" size="sm">
            Aktivliklar sahifasi kelajakda tayyorlanmoqda...
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
