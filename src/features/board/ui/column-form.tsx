import { Button, Group, MultiSelect, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { BoardColumn, ColumnStatus } from "@/entities/board";
import { createZodValidator } from "@/shared/lib";
import { getErrorMessage } from "../model/get-error-message";
import { createColumnSchema } from "../model/schema";
import { useEffect } from "react";
import {
  useColumnCreate,
  useColumnStatuses,
  useColumnStatusAdd,
  useColumnStatusRemove,
  useColumnUpdate,
  useProjectStatuses,
} from "../model/use-board";

type ColumnFormValues = {
  name: string;
  statusIds: string[];
};

interface ColumnFormProps {
  boardId: string;
  /** Project whose statuses can be mapped to the column */
  projectId: string;
  /** All columns on the board, used to name the column a status belongs to */
  columns: BoardColumn[];
  /** Current status mappings of the board's columns, keyed by column id */
  statusesByColumn: Record<string, ColumnStatus[] | undefined>;
  /** Column being edited; omit to create a new one */
  column?: BoardColumn;
  /** Order assigned to a newly created column */
  nextOrder?: number;
  onSuccess?: () => void;
}

export function ColumnForm({
  boardId,
  projectId,
  columns,
  statusesByColumn,
  column,
  nextOrder = 0,
  onSuccess,
}: ColumnFormProps) {
  const { mutateAsync: createColumn } = useColumnCreate(boardId);
  const { mutateAsync: updateColumn } = useColumnUpdate(boardId);
  const { mutateAsync: addStatus } = useColumnStatusAdd(column?.id ?? "");
  const { mutateAsync: removeStatus } = useColumnStatusRemove(column?.id ?? "");
  const { data: statuses } = useProjectStatuses(projectId);
  // Same cache as statusesByColumn; used to know when this column's mappings have loaded
  const { data: ownStatuses, isLoading: isOwnStatusesLoading } =
    useColumnStatuses(column?.id ?? "");

  const currentStatusIds = (ownStatuses ?? []).map((item) => item.statusId);

  const form = useForm<ColumnFormValues>({
    initialValues: {
      name: column?.name ?? "",
      statusIds: currentStatusIds,
    },
    validate: createZodValidator(
      createColumnSchema.pick({ name: true, statusIds: true }),
    ),
  });

  // If the dialog opened before mappings loaded, fill them in once they arrive,
  // otherwise saving would treat every existing status as removed
  // biome-ignore lint/correctness/useExhaustiveDependencies: initialize once per loaded mapping list
  useEffect(() => {
    if (column && ownStatuses) {
      form.initialize({
        name: column.name,
        statusIds: ownStatuses.map((item) => item.statusId),
      });
    }
  }, [ownStatuses]);

  // A status can belong to only one column per board
  const takenBy = new Map<string, string>();
  for (const other of columns) {
    if (other.id === column?.id) {
      continue;
    }
    for (const item of statusesByColumn[other.id] ?? []) {
      takenBy.set(item.statusId, other.name);
    }
  }

  const statusOptions = (statuses ?? []).map((status) => {
    const owner = takenBy.get(status.id);
    return {
      value: status.id,
      label: owner ? `${status.name} (${owner})` : status.name,
      disabled: Boolean(owner),
    };
  });

  const handleSubmit = async ({ name, statusIds }: ColumnFormValues) => {
    try {
      if (column) {
        if (name !== column.name) {
          await updateColumn({ id: column.id, data: { name } });
        }

        // PUT /columns/:id doesn't accept statuses, so mappings are synced one by one
        const removed = currentStatusIds.filter((id) => !statusIds.includes(id));
        const added = statusIds.filter((id) => !currentStatusIds.includes(id));

        for (const statusId of removed) {
          await removeStatus(statusId);
        }
        for (const statusId of added) {
          await addStatus({ statusId, order: statusIds.indexOf(statusId) });
        }
      } else {
        await createColumn({
          boardId,
          name,
          order: nextOrder,
          statusIds: statusIds.length > 0 ? statusIds : undefined,
        });
        form.reset();
      }

      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: "Xatolik",
        message: getErrorMessage(error, "Ustunni saqlashda xatolik yuz berdi"),
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Ustun nomi"
          placeholder="Masalan: Jarayonda"
          data-autofocus
          required
          {...form.getInputProps("name")}
        />

        <MultiSelect
          label="Statuslar"
          description="Ushbu ustundagi vazifalar qabul qila oladigan statuslar. Boshqa ustunga biriktirilgan statusni tanlab bo'lmaydi."
          placeholder="Statuslarni tanlang"
          data={statusOptions}
          disabled={isOwnStatusesLoading}
          searchable
          clearable
          nothingFoundMessage="Status topilmadi"
          {...form.getInputProps("statusIds")}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={form.submitting}
            disabled={isOwnStatusesLoading}
          >
            {column ? "Saqlash" : "Qo'shish"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
