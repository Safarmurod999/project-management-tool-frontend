import { TextInput, Button, Stack, Group, Text, PinInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createZodValidator } from '@/shared/lib';
import { otpRequestSchema, otpVerifySchema, type OTPRequestData, type OTPVerifyData } from '../model/schema';
import { useSendOtp, useVerifyOtp } from '../model/use-otp';
import styles from './otp-form.module.scss';

interface OTPFormProps {
  userId?: string;
  onVerifySuccess?: () => void;
}

export function OTPForm({ userId, onVerifySuccess }: OTPFormProps) {
  const navigate = useNavigate();
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  const requestForm = useForm<OTPRequestData>({
    initialValues: {
      email: '',
    },
    validate: createZodValidator(otpRequestSchema),
  });

  const verifyForm = useForm<OTPVerifyData>({
    initialValues: {
      code: '',
    },
    validate: createZodValidator(otpVerifySchema),
  });

  const handleSendOtp = (values: OTPRequestData) => {
    sendOtp(values, {
      onSuccess: (response) => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'OTP kod emailingizga yuborildi',
          color: 'green',
        });
        setOtpToken(response.data.token);
        setEmail(values.email);
        
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

  const handleVerifyOtp = (values: OTPVerifyData) => {
    if (!otpToken) {
      notifications.show({
        title: 'Xatolik',
        message: 'OTP token topilmadi',
        color: 'red',
      });
      return;
    }

    verifyOtp(
      { token: otpToken, code: values.code },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Muvaffaqiyatli',
            message: 'Email muvaffaqiyatli tasdiqlandi',
            color: 'green',
          });

          if (onVerifySuccess) {
            onVerifySuccess();
          } else if (userId) {
            // Navigate to user verification page if userId is provided
            navigate(`/verify-user?userId=${userId}&token=${otpToken}`);
          } else {
            // Reset forms if no userId provided
            requestForm.reset();
            verifyForm.reset();
            setOtpToken(null);
            setEmail('');
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
      }
    );
  };

  if (otpToken) {
    return (
      <form onSubmit={verifyForm.onSubmit(handleVerifyOtp)} className={styles.form}>
        <Stack gap="md">
          <div>
            <Text size="sm" mb="xs">
              {email} manziliga yuborilgan OTP kodni kiriting
            </Text>
          </div>
          <PinInput
            length={6}
            size="md"
            type="number"
            placeholder="0"
            {...verifyForm.getInputProps('code')}
          />
          <Group gap="xs">
            <Button 
              type="submit" 
              fullWidth 
              size="md"
              loading={isVerifyingOtp}
            >
              Tasdiqlash
            </Button>
            <Button 
              variant="light"
              fullWidth 
              size="md"
              onClick={() => {
                setOtpToken(null);
                setEmail('');
                verifyForm.reset();
              }}
            >
              Orqaga
            </Button>
          </Group>
        </Stack>
      </form>
    );
  }

  return (
    <form onSubmit={requestForm.onSubmit(handleSendOtp)} className={styles.form}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          size="md"
          className={styles.input}
          {...requestForm.getInputProps('email')}
        />
        <Button 
          type="submit" 
          fullWidth 
          size="md"
          loading={isSendingOtp}
        >
          OTP kodni yuborish
        </Button>
      </Stack>
    </form>
  );
}
