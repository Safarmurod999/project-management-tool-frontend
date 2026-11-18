import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  ColorInput,
  ColorSwatch,
  Group,
  Loader,
  Modal,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Edit, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Status } from "@/entities/board";
import { Access, useAccess } from "@/entities/user";
import { createZodValidator } from "@/shared/lib";
import { getErrorMessage } from "../model/get-error-message";
import { createStatusSchema } from "../model/schema";
import {
  useProjectStatuses,
  useStatusCreate,
  useStatusDelete,
  useStatusReorder,
  useStatusUpdate,
} from "../model/use-board";

const DEFAULT_COLOR = "#9E9E9E";

type StatusModal = { mode: "create" } | { mode: "edit"; status: Status };

interface StatusManagerProps {
  projectId: string;
}

export function StatusManager({ projectId }: StatusManagerProps) {
  const { data: statuses, isLoading, isError } = useProjectStatuses(projectId);
  const { mutate: deleteStatus } = useStatusDelete(projectId);
  const { mutate: reorderStatuses } = useStatusReorder(projectId);

  const canCreate = useAccess(Access.STATUS_CREATE);
  const canEdit = useAccess(Access.STATUS_EDIT);
  const canDelete = useAccess(Access.STATUS_DELETE);

  const [modal, setModal] = useState<StatusModal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!statuses || !over || active.id === over.id) {
      return;
    }

    const oldIndex = statuses.findIndex((status) => status.id === active.id);
    const newIndex = statuses.findIndex((status) => status.id === over.id);

    reorderStatuses(arrayMove(statuses, oldIndex, newIndex), {
      onError: (error) => {
        notifications.show({
          title: "Xatolik",
          message: getErrorMessage(error, "Tartibni saqlab bo'lmadi"),
          color: "red",
        });
      },
    });
  };

  const handleDelete = (status: Status) => {
    if (!window.confirm(`"${status.name}" statusini o'chirishni xohlaysizmi?`)) {
      return;
    }

    deleteStatus(status.id, {
      onSuccess: () => {
        notifications.show({
          title: "Muvaffaqiyatli",
          message: "Status o'chirildi",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Xatolik",
          message: getErrorMessage(error, "Statusni o'chirib bo'lmadi"),
          color: "red",
        });
      },
    });
  };

  const nextOrder =
    statuses && statuses.length > 0
      ? Math.max(...statuses.map((status) => status.order)) + 1
      : 0;

  return (
    <Card withBorder radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={2}>
            <Text fw={600} size="lg">
              Statuslar
            </Text>

            <Text size="sm" c="dimmed">
              Vazifalar uchun loyiha statuslari. Tartibni sudrab o'zgartiring.
            </Text>
          </Stack>

          {canCreate ? (
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => setModal({ mode: "create" })}
            >
              Status qo'shish
            </Button>
          ) : null}
        </Group>

        {isLoading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : isError ? (
          <Text ta="center" c="red" size="sm">
            Statuslarni yuklashda xatolik yuz berdi
          </Text>
        ) : statuses && statuses.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={statuses.map((status) => status.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xs">
                {statuses.map((status) => (
                  <StatusRow
                    key={status.id}
                    status={status}
                    sortable={canEdit}
                    onEdit={
                      canEdit
                        ? () => setModal({ mode: "edit", status })
                        : undefined
                    }
                    onDelete={canDelete ? () => handleDelete(status) : undefined}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : (
          <Text ta="center" c="dimmed" size="sm" py="md">
            Hozircha hech qanday status yo'q
          </Text>
        )}
      </Stack>

      <Modal
        opened={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Statusni tahrirlash" : "Yangi status"}
      >
        {modal ? (
          <StatusForm
            projectId={projectId}
            status={modal.mode === "edit" ? modal.status : undefined}
            nextOrder={nextOrder}
            onSuccess={() => setModal(null)}
          />
        ) : null}
      </Modal>
    </Card>
  );
}

interface StatusRowProps {
  status: Status;
  sortable: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function StatusRow({ status, sortable, onEdit, onDelete }: StatusRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.id, disabled: !sortable });

  return (
    <Card
      ref={setNodeRef}
      withBorder
      radius="sm"
      p="xs"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          {sortable ? (
            <ActionIcon
              ref={setActivatorNodeRef}
              variant="subtle"
              color="gray"
              style={{ cursor: "grab" }}
              aria-label="Tartibni o'zgartirish"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </ActionIcon>
          ) : null}

          <ColorSwatch color={status.color} size={16} />

          <Text fw={500} truncate>
            {status.name}
          </Text>

          <Text size="xs" c="dimmed">
            {status.code}
          </Text>

          {status.isDefault ? (
            <Badge size="xs" variant="light">
              Standart
            </Badge>
          ) : null}

          {status.isDone ? (
            <Badge
              size="xs"
              variant="light"
              color="teal"
              leftSection={<CheckCircle2 size={10} />}
            >
              Tugagan
            </Badge>
          ) : null}
        </Group>

        <Group gap={4} wrap="nowrap">
          {onEdit ? (
            <Tooltip label="Tahrirlash">
              <ActionIcon variant="subtle" color="gray" onClick={onEdit}>
                <Edit size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}

          {onDelete ? (
            <Tooltip label="O'chirish">
              <ActionIcon variant="subtle" color="red" onClick={onDelete}>
                <Trash2 size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </Group>
      </Group>
    </Card>
  );
}

type StatusFormValues = {
  name: string;
  color: string;
  isDone: boolean;
};

interface StatusFormProps {
  projectId: string;
  /** Status being edited; omit to create a new one */
  status?: Status;
  nextOrder: number;
  onSuccess?: () => void;
}

function StatusForm({ projectId, status, nextOrder, onSuccess }: StatusFormProps) {
  const { mutate: createStatus, isPending: isCreating } = useStatusCreate();
  const { mutate: updateStatus, isPending: isUpdating } = useStatusUpdate();

  const form = useForm<StatusFormValues>({
    initialValues: {
      name: status?.name ?? "",
      color: status?.color ?? DEFAULT_COLOR,
      isDone: status?.isDone ?? false,
    },
    validate: createZodValidator(
      createStatusSchema.pick({ name: true, color: true }),
    ),
  });

  const callbacks = {
    onSuccess: () => {
      notifications.show({
        title: "Muvaffaqiyatli",
        message: status ? "Status yangilandi" : "Status yaratildi",
        color: "green",
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      notifications.show({
        title: "Xatolik",
        message: getErrorMessage(error, "Statusni saqlashda xatolik yuz berdi"),
        color: "red",
      });
    },
  };

  const handleSubmit = (values: StatusFormValues) => {
    if (status) {
      updateStatus({ id: status.id, data: values }, callbacks);
      return;
    }

    createStatus({ ...values, projectId, order: nextOrder }, callbacks);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Status nomi"
          placeholder="Masalan: Jarayonda"
          data-autofocus
          required
          {...form.getInputProps("name")}
        />

        <ColorInput
          label="Rang"
          format="hex"
          swatches={[
            "#9E9E9E",
            "#228BE6",
            "#40C057",
            "#FAB005",
            "#FD7E14",
            "#FA5252",
            "#BE4BDB",
            "#15AABF",
          ]}
          required
          {...form.getInputProps("color")}
        />

        <Switch
          label="Tugagan status"
          description="Bu statusdagi vazifalar bajarilgan hisoblanadi"
          {...form.getInputProps("isDone", { type: "checkbox" })}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={isCreating || isUpdating}>
            {status ? "Saqlash" : "Yaratish"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
