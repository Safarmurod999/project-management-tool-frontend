import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createZodValidator } from '@/shared/lib';
import { updateTeamSchema, type UpdateTeamFormData } from '../model/schema';
import { useTeamUpdate } from '../model/use-team';

interface EditTeamFormProps {
  teamId: string;
  initialValues: { name: string; description: string };
  onSuccess?: () => void;
}

export function EditTeamForm({ teamId, initialValues, onSuccess }: EditTeamFormProps) {
  const { mutate: updateTeam, isPending } = useTeamUpdate();

  const form = useForm<UpdateTeamFormData>({
    initialValues: {
      name: initialValues.name,
      description: initialValues.description,
      status: undefined,
    },
    validate: createZodValidator(updateTeamSchema),
  });

  const handleSubmit = (values: UpdateTeamFormData) => {
    updateTeam({ id: teamId, data: values }, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Jamoa yangilandi',
          color: 'green',
        });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        let errorMessage = 'Jamoani yangilashda xatolik yuz berdi';
        if (error instanceof Error) errorMessage = error.message;
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
            Saqlash
          </Button>
        </Group>
      </Stack>
    </form>
  );
}