import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createZodValidator } from '@/shared/lib';
import { createTeamSchema, type CreateTeamFormData } from '../model/schema';
import { useTeamCreate } from '../model/use-team';

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

export function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const { mutate: createTeam, isPending } = useTeamCreate();

  const form = useForm<CreateTeamFormData>({
    initialValues: {
      name: '',
      description: '',
    },
    validate: createZodValidator(createTeamSchema),
  });

  const handleSubmit = (values: CreateTeamFormData) => {
    createTeam(values, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Jamoa muvaffaqiyatli yaratildi',
          color: 'green',
        });
        form.reset();
        onSuccess?.();
      },
      onError: (error: unknown) => {
        let errorMessage = 'Jamoa yaratishda xatolik yuz berdi';

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
            const data = (response as Record<string, unknown>).data;
            if (typeof data === 'object' && data !== null && 'message' in data) {
              errorMessage = String((data as Record<string, unknown>).message);
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Jamoa nomi"
          placeholder="Jamoa nomini kiriting"
          {...form.getInputProps('name')}
          required
        />

        <Textarea
          label="Tavsif"
          placeholder="Jamoa haqida qisqacha ma'lumot"
          minRows={3}
          {...form.getInputProps('description')}
          required
        />

        <Group justify="flex-end">
          <Button type="submit" loading={isPending}>
            Yaratish
          </Button>
        </Group>
      </Stack>
    </form>
  );
}