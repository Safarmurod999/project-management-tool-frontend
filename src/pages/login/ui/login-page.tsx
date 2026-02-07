import { Container, Paper, Title, Text } from '@mantine/core';
import { LoginForm } from '@/features/auth';
import styles from './login-page.module.scss';

export function LoginPage() {
  return (
    <div className={styles.root}>
      <Container size={420} className={styles.container}>
        <Paper 
          withBorder 
          shadow="md" 
          p={30} 
          radius="md"
          className={styles.paper}
        >
          <Title order={2} ta="center" mb="md" className={styles.title}>
            Tizimga kirish
          </Title>
          <Text size="sm" ta="center" mb="xl" className={styles.subtitle}>
            Project Management Tool
          </Text>
          <LoginForm />
        </Paper>
      </Container>
    </div>
  );
}
