import { Button, Group, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type Board, BoardStatus } from "@/entities/board";
import { createZodValidator } from "@/shared/lib";
import { getErrorMessage } from "../model/get-error-message";
import {
  type CreateBoardFormData,
  createBoardSchema,
  type UpdateBoardFormData,
  updateBoardSchema,
} from "../model/schema";
import { useBoardCreate, useBoardUpdate } from "../model/use-board";

export const boardStatusOptions = [
  { value: BoardStatus.ACTIVE, label: "Faol" },
  { value: BoardStatus.ARCHIVED, label: "Arxivlangan" },
];

interface CreateBoardFormProps {
  projectId: string;
  onSuccess?: (board: Board) => void;
}

export function CreateBoardForm({ projectId, onSuccess }: CreateBoardFormProps) {
  const { mutate: createBoard, isPending } = useBoardCreate();

  const form = useForm<CreateBoardFormData>({
    initialValues: {
      projectId,
      name: "",
      description: "",
    },
    validate: createZodValidator(createBoardSchema),
  });

  const handleSubmit = (values: CreateBoardFormData) => {
    createBoard(values, {
      onSuccess: (response) => {
        notifications.show({
          title: "Muvaffaqiyatli",
          message: "Board muvaffaqiyatli yaratildi",
          color: "green",
        });
        form.reset();
        onSuccess?.(response.data);
      },
      onError: (error) => {
        notifications.show({
          title: "Xatolik",
          message: getErrorMessage(error, "Board yaratishda xatolik yuz berdi"),
          color: "red",
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Board nomi"
          placeholder="Masalan: Sprint 1"
          data-autofocus
          required
          {...form.getInputProps("name")}
        />

        <Textarea
          label="Tavsif"
          placeholder="Board haqida qisqacha ma'lumot"
          minRows={3}
          autosize
          {...form.getInputProps("description")}
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

interface EditBoardFormProps {
  board: Board;
  onSuccess?: () => void;
}

export function EditBoardForm({ board, onSuccess }: EditBoardFormProps) {
  const { mutate: updateBoard, isPending } = useBoardUpdate();

  const form = useForm<UpdateBoardFormData>({
    initialValues: {
      name: board.name,
      description: board.description ?? "",
      status: board.status,
    },
    validate: createZodValidator(updateBoardSchema),
  });

  const handleSubmit = (values: UpdateBoardFormData) => {
    updateBoard(
      { id: board.id, data: values },
      {
        onSuccess: () => {
          notifications.show({
            title: "Muvaffaqiyatli",
            message: "Board muvaffaqiyatli yangilandi",
            color: "green",
          });
          onSuccess?.();
        },
        onError: (error) => {
          notifications.show({
            title: "Xatolik",
            message: getErrorMessage(
              error,
              "Boardni yangilashda xatolik yuz berdi",
            ),
            color: "red",
          });
        },
      },
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Board nomi"
          placeholder="Board nomini kiriting"
          required
          {...form.getInputProps("name")}
        />

        <Textarea
          label="Tavsif"
          placeholder="Board haqida qisqacha ma'lumot"
          minRows={3}
          autosize
          {...form.getInputProps("description")}
        />

        <Select
          label="Holati"
          data={boardStatusOptions}
          allowDeselect={false}
          required
          {...form.getInputProps("status")}
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
