import { Container, Paper, Title, Text } from '@mantine/core';
import { RegisterForm } from '@/features/auth';
import styles from './register-page.module.scss';

export function RegisterPage() {
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
            Ro'yxatdan o'tish
          </Title>
          <Text size="sm" ta="center" mb="xl" className={styles.subtitle}>
            Project Management Tool
          </Text>
          <RegisterForm />
        </Paper>
      </Container>
    </div>
  );
}
