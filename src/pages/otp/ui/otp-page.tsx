import { useSearchParams } from 'react-router-dom';
import { Container, Paper, Title, Text } from '@mantine/core';
import { OTPForm } from '@/features/otp';
import styles from './otp-page.module.scss';

export function OTPPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

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
            Email tasdiqlash
          </Title>
          <Text size="sm" ta="center" mb="xl" className={styles.subtitle}>
            Emailingizni tasdiqlash uchun OTP kodni kiriting
          </Text>
          <OTPForm userId={userId || undefined} />
        </Paper>
      </Container>
    </div>
  );
}
