import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Title, Text, Stack, Button, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useVerifyUserRegistration } from '@/features/auth';
import styles from './user-verification-page.module.scss';

export function UserVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const { mutate: verifyRegistration } = useVerifyUserRegistration();

  const userId = searchParams.get('userId');
  const otpToken = searchParams.get('token');

  useEffect(() => {
    if (!userId || !otpToken) {
      setVerificationError('Noto\'g\'ri URL parametrlari');
      setIsVerifying(false);
      return;
    }

    // Auto-verify on component mount
    const verifyUser = async () => {
      verifyRegistration(
        { userId, token: otpToken },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Muvaffaqiyatli',
              message: 'Hisobingiz muvaffaqiyatli tasdiqlandi',
              color: 'green',
            });

            // Redirect to home after 1.5 seconds
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1500);
          },
          onError: (error: unknown) => {
            let errorMessage = 'Nimadadir xato yuz berdi';

            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (
              typeof error === 'object' &&
              error !== null &&
              'response' in error
            ) {
              const response = (error as Record<string, unknown>).response;
              if (
                typeof response === 'object' &&
                response !== null &&
                'data' in response
              ) {
                const data = response.data as Record<string, unknown>;
                if (typeof data.message === 'string') {
                  errorMessage = data.message;
                }
              }
            }

            notifications.show({
              title: 'Xatolik',
              message: errorMessage,
              color: 'red',
            });

            setVerificationError(errorMessage);
            setIsVerifying(false);
          },
        }
      );
    };

    verifyUser();
  }, [userId, otpToken, verifyRegistration, navigate]);

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
            Hisobni tasdiqlash
          </Title>

          {isVerifying && !verificationError && (
            <Stack gap="md" align="center">
              <Loader size="lg" />
              <Text size="sm" ta="center" c="dimmed">
                Hisobingiz tasdiqlanmoqda...
              </Text>
            </Stack>
          )}

          {verificationError && (
            <Stack gap="md" align="center">
              <Text size="sm" ta="center" c="dimmed" mb="md">
                {verificationError}
              </Text>
              <Button
                variant="light"
                fullWidth
                onClick={() => navigate('/register')}
              >
                Ro'yxatdan o'tish
              </Button>
              <Button
                variant="subtle"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Tizimga kirish
              </Button>
            </Stack>
          )}
        </Paper>
      </Container>
    </div>
  );
}
