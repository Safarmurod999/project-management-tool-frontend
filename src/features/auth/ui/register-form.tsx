import { TextInput, PasswordInput, Button, Stack, Anchor, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { createZodValidator } from '@/shared/lib';
import { registerSchema, type RegisterFormData } from '../model/schema';
import { useRegister } from '../model/use-register';
import styles from './register-form.module.scss';

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormData>({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },
    validate: createZodValidator(registerSchema),
  });

  const handleSubmit = (values: RegisterFormData) => {
    register(values, {
      onSuccess: (response) => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Hisobingiz muvaffaqiyatli yaratildi',
          color: 'green',
        });

        const userData = response.data;
        const userId = userData.id;
        
        // Redirect to OTP page with userId
        if (userId) {
          navigate(`/verify-otp?userId=${userId}`);
        } else {
          navigate('/verify-otp');
        }
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
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          size="md"
          className={styles.input}
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Ism"
          placeholder="Ismingizni kiriting"
          required
          size="md"
          className={styles.input}
          {...form.getInputProps('name')}
        />
        <PasswordInput
          label="Parol"
          placeholder="Parolingizni kiriting"
          required
          size="md"
          className={styles.input}
          {...form.getInputProps('password')}
        />
        <Button 
          type="submit" 
          fullWidth 
          size="md"
          loading={isPending}
        >
          Ro'yxatdan o'tish
        </Button>
        <Group justify="center" gap="xs">
          <span>Allaqachon hisobingiz bormi?</span>
          <Anchor 
            size="sm" 
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          >
            Tizimga kirish
          </Anchor>
        </Group>
      </Stack>
    </form>
  );
}
