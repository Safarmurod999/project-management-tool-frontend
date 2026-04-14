import { TextInput, Textarea, Button, Stack, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createZodValidator } from '@/shared/lib';
import { updateProjectSchema, type UpdateProjectFormData } from '../model/schema';
import { useProjectUpdate } from '../model/use-project';
import { ProjectStatus } from '@/entities/project/model/types';
import { useTeams } from '@/features/team';

interface EditProjectFormProps {
  projectId: string;
  initialValues: { name: string; description: string; status: string; teamId: string;};
  onSuccess?: () => void;
}

export function EditProjectForm({ projectId, initialValues, onSuccess }: EditProjectFormProps) {
  const { mutate: updateProject, isPending } = useProjectUpdate();

  const { data, isFetched } = useTeams();

  const form = useForm<UpdateProjectFormData>({
    initialValues: {
      name: initialValues.name,
      description: initialValues.description,
      teamId: initialValues.teamId,
      status: initialValues.status,
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
          error={form.errors.name}
          required
        />

        <Textarea
          label="Tavsif"
          placeholder="Loyiha haqida qisqacha ma'lumot"
          minRows={3}
          {...form.getInputProps('description')}
          error={form.errors.description}
          required
        />

        <Select
          label="Jamoa"
          placeholder="Jamoa tanlang"
          data={isFetched && data && data.length > 0 ?
            data.map(team => ({
              value: team.id,
              label: team.name
            }))
            :
            [{
              value: '',
              label: 'Jamoa topilmadi',
              disabled: true
            }]}
          {...form.getInputProps('teamId')}
          error={form.errors.teamId}
          required
        />

        <Select
          label="Holati"
          placeholder="Loyiha holatini tanlang"
          data={
            Object.values(ProjectStatus).map(status => ({
              value: status,
              label: status
            }))
          }
          {...form.getInputProps('status')}
          error={form.errors.status}
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