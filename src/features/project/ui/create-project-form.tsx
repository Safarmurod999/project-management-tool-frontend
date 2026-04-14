import { TextInput, Textarea, Button, Stack, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createZodValidator } from '@/shared/lib';
import { createProjectSchema, type CreateProjectFormData } from '../model/schema';
import { useProjectCreate } from '../model/use-project';
import { useTeams } from '@/features/team';
import { ProjectStatus } from '@/entities/project/model/types';
import { useAuthStore } from '@/entities/user';

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const { user } = useAuthStore();  

  const { mutate: createProject, isPending } = useProjectCreate();

  const { data, isFetched } = useTeams();

  const form = useForm<CreateProjectFormData>({
    initialValues: {
      name: '',
      teamId: '',
      description: '',
      userId: user?.id || '',
      roleId: user?.role.id || '',
      status: ProjectStatus.ACTIVE,
    },
    validate: createZodValidator(createProjectSchema),
  });

  const handleSubmit = (values: CreateProjectFormData) => {
    createProject(values, {
      onSuccess: () => {
        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Loyiha muvaffaqiyatli yaratildi',
          color: 'green',
        });
        form.reset();
        onSuccess?.();
      },
      onError: (error: unknown) => {
        let errorMessage = 'Loyiha yaratishda xatolik yuz berdi';

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