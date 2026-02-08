import { Container, Title, Text, Stack, Card, Group, Button } from '@mantine/core';
import { LayoutGrid, Plus, BarChart3, CheckCircle2, BookOpen, Target, Bell } from 'lucide-react';

export function HomePage() {
  return (
    <Container size="xl" py="md">
      <Group justify="space-between" align="center" mb="xl">
        <div>
          <Title order={1} size={32} fw={700} mb={4}>
            Asosiy Sahifa
          </Title>
          <Text c="dimmed" size="sm">
            Sizning loyihalar, vazifalar va aktivliklar
          </Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          variant="filled"
          color="blue"
          size="md"
        >
          Yangi Loyiha
        </Button>
      </Group>

      <Stack gap="lg">
        <Card withBorder padding="lg" radius="lg">
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between" align="center">
              <div>
                <Group gap={8}>
                  <BarChart3 size={20} color="var(--mantine-color-blue-6)" />
                  <Title order={3} size={18}>Sizning Loyihalar</Title>
                </Group>
                <Text c="dimmed" size="sm">
                  Hamkasblar bilan ishlayotgan loyihalar
                </Text>
              </div>
              <Button
                leftSection={<LayoutGrid size={16} />}
                variant="subtle"
                color="blue"
                size="xs"
              >
                Barchasi
              </Button>
            </Group>
          </Card.Section>
          <Text c="dimmed" size="sm" py="lg">
            Hozircha loyiha mavjud emas. Yangi loyiha yaratish uchun yuqoridagi tugmani bosing.
          </Text>
        </Card>

        <Card withBorder padding="lg" radius="lg">
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between" align="center">
              <div>
                <Group gap={8}>
                  <CheckCircle2 size={20} color="var(--mantine-color-blue-6)" />
                  <Title order={3} size={18}>Mening Vazifalarim</Title>
                </Group>
                <Text c="dimmed" size="sm">
                  Rozilik olish uchun mo'ljallangan vazifalar
                </Text>
              </div>
              <Button
                leftSection={<LayoutGrid size={16} />}
                variant="subtle"
                color="blue"
                size="xs"
              >
                Barchasi
              </Button>
            </Group>
          </Card.Section>
          <Text c="dimmed" size="sm" py="lg">
            Siz uchun tayinlangan vazifa yo'q.
          </Text>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16,
          }}
        >
          <Card withBorder padding="lg" radius="lg">
            <Group justify="center" mb="md">
              <BookOpen size={32} color="var(--mantine-color-blue-6)" />
            </Group>
            <Title order={4} ta="center" mb={4}>
              Qo'llanma va Resurslar
            </Title>
            <Text ta="center" c="dimmed" size="sm">
              Loyihani boshqarish uchun foydali havola va hujjatlar
            </Text>
          </Card>

          <Card withBorder padding="lg" radius="lg">
            <Group justify="center" mb="md">
              <Target size={32} color="var(--mantine-color-blue-6)" />
            </Group>
            <Title order={4} ta="center" mb={4}>
              Mening Statistikam
            </Title>
            <Text ta="center" c="dimmed" size="sm">
              Sizning faollik va mahsuldorlik metrikalari
            </Text>
          </Card>

          <Card withBorder padding="lg" radius="lg">
            <Group justify="center" mb="md">
              <Bell size={32} color="var(--mantine-color-blue-6)" />
            </Group>
            <Title order={4} ta="center" mb={4}>
              Oxirgi Xabarlar
            </Title>
            <Text ta="center" c="dimmed" size="sm">
              Loyiha va jamoa aktivliklari haqida bildirishnomalar
            </Text>
          </Card>
        </div>
      </Stack>
    </Container>
  );
}
