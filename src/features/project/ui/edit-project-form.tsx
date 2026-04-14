import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createZodValidator } from '@/shared/lib';
import { updateProjectSchema, type UpdateProjectFormData } from '../model/schema';
import { useProjectUpdate } from '../model/use-project';

interface EditProjectFormProps {
  projectId: string;
  initialValues: { name: string; description: string };
  onSuccess?: () => void;
}

export function EditProjectForm({ projectId, initialValues, onSuccess }: EditProjectFormProps) {
  const { mutate: updateProject, isPending } = useProjectUpdate();

  const form = useForm<UpdateProjectFormData>({
    initialValues: {
      name: initialValues.name,
      description: initialValues.description,
      status: undefined,
    },
    validate: createZodValidator(updateProjectSchema),
  });

  const handleSubmit = (values: UpdateProjectFormData) => {
    updateProject({ id: projectId, data: values }, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Loyiha yangilandi',
          color: 'green',
        });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        let errorMessage = 'Loyihani yangilashda xatolik yuz berdi';
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
          label="Loyiha nomi"
          placeholder="Loyiha nomini kiriting"
          {...form.getInputProps('name')}
          required
        />

        <Textarea
          label="Tavsif"
          placeholder="Loyiha haqida qisqacha ma'lumot"
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