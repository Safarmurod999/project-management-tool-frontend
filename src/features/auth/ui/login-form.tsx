import { TextInput, PasswordInput, Button, Stack, Anchor, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { createZodValidator } from '@/shared/lib';
import { loginSchema, type LoginFormData } from '../model/schema';
import { useLogin } from '../model/use-login';
import styles from './login-form.module.scss';

export function LoginForm() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: createZodValidator(loginSchema),
  });

  const handleSubmit = (values: LoginFormData) => {
    login(values, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Tizimga muvaffaqiyatli kirdingiz',
          color: 'green',
        });
        navigate('/');
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
        <div>
          <PasswordInput
            label="Parol"
            placeholder="Parolingizni kiriting"
            required
            size="md"
            className={styles.input}
            {...form.getInputProps('password')}
          />
          <Group justify="flex-end" mt="xs">
            <Anchor 
              size="sm" 
              c="dimmed"
              onClick={() => {/* Parolni tiklash */}}
            >
              Parolni unutdingizmi?
            </Anchor>
          </Group>
        </div>
        <Button 
          type="submit" 
          fullWidth 
          size="md"
          loading={isPending}
          className={styles.submitButton}
        >
          Kirish
        </Button>
      </Stack>
    </form>
  );
}
