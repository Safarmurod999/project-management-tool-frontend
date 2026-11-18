import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ArrowRight, Trash2, TriangleAlert } from "lucide-react";
import {
  type BoardCard,
  type BoardColumn,
  type ColumnStatus,
  isTransitionAllowed,
} from "@/entities/board";
import { Access, useAccess, useAuthStore } from "@/entities/user";
import { useUsers } from "@/features/users/model/use-user";
import { createZodValidator } from "@/shared/lib";
import { getErrorMessage, isConflictError } from "../model/get-error-message";
import { cardFormSchema } from "../model/schema";
import {
  useCardCreate,
  useCardDelete,
  useCardUpdate,
  useColumnStatuses,
} from "../model/use-board";
import { useCardTransition, useProjectWorkflow } from "../model/use-workflow";

type CardFormValues = {
  title: string;
  description: string;
  statusId: string | null;
  assigneeId: string | null;
  points: number;
};

interface CardFormProps {
  boardId: string;
  /** The board's project, whose default workflow governs card statuses */
  projectId: string;
  columns: BoardColumn[];
  /** Status mappings of every board column; a column is undefined while loading */
  statusesByColumn: Record<string, ColumnStatus[] | undefined>;
  columnId: string;
  /** Card being edited; omit to create a new one */
  card?: BoardCard;
  /** Order assigned to a newly created card */
  nextOrder?: number;
  onSuccess?: () => void;
}

export function CardForm({
  boardId,
  projectId,
  columns,
  statusesByColumn,
  columnId,
  card,
  nextOrder = 0,
  onSuccess,
}: CardFormProps) {
  const user = useAuthStore((state) => state.user);
  const { data: users } = useUsers();
  const canEdit = useAccess(Access.CARD_EDIT);
  const canDelete = useAccess(Access.CARD_DELETE);
  // A card may only use statuses mapped to its column
  const { data: columnStatuses } = useColumnStatuses(columnId);
  // null: no workflow (unrestricted); undefined: unknown, so the backend decides
  const { data: workflow, isLoading: isWorkflowLoading } =
    useProjectWorkflow(projectId);
  // With a workflow, an existing card changes status only through its transitions
  const usesTransitions = Boolean(card && workflow);

  const { mutate: createCard, isPending: isCreating } = useCardCreate(boardId);
  const { mutate: updateCard, isPending: isUpdating } = useCardUpdate(boardId);
  const { mutate: deleteCard, isPending: isDeleting } = useCardDelete(boardId);
  const {
    mutate: transitionCard,
    isPending: isTransitioning,
    variables: transitionVariables,
  } = useCardTransition(boardId);

  const form = useForm<CardFormValues>({
    initialValues: {
      title: card?.title ?? "",
      description: card?.description ?? "",
      statusId: card?.statusId ?? null,
      assigneeId: card?.assigneeId ?? null,
      points: card?.points ?? 0,
    },
    validate: createZodValidator(cardFormSchema),
  });

  const handleError = (error: unknown) => {
    notifications.show({
      title: "Xatolik",
      message: getErrorMessage(error, "Vazifani saqlashda xatolik yuz berdi"),
      color: "red",
    });
  };

  const hasNoStatuses = columnStatuses?.length === 0;
  // A new card has no current status, so this only drops statuses outside the workflow
  const selectableStatuses = (columnStatuses ?? []).filter(({ statusId }) =>
    isTransitionAllowed(workflow, card?.statusId, statusId),
  );
  const hasNoWorkflowStatuses =
    !hasNoStatuses && !!columnStatuses && selectableStatuses.length === 0;

  const columnById = new Map(columns.map((column) => [column.id, column]));
  const columnIdByStatusId = new Map(
    Object.entries(statusesByColumn).flatMap(([id, mappings]) =>
      (mappings ?? []).map((mapping) => [mapping.statusId, id] as const),
    ),
  );
  // Targets in a column whose mappings haven't loaded would be missing
  const isMappingsLoading = Object.values(statusesByColumn).some(
    (mappings) => mappings === undefined,
  );
  const currentStatus = workflow?.statuses.find(
    (status) => status.id === card?.statusId,
  );

  // Rules leaving the current status whose target is mapped on this board;
  // only narrows what is offered, the backend still validates the transition
  const transitionActions =
    card && workflow
      ? workflow.transitions.flatMap((transition) => {
          const status = workflow.statuses.find(
            (item) => item.id === transition.toStatusId,
          );
          const targetColumnId = columnIdByStatusId.get(transition.toStatusId);

          return transition.fromStatusId === card.statusId &&
            status &&
            targetColumnId
            ? [{ transition, status, targetColumnId }]
            : [];
        })
      : [];

  const handleTransition = (transitionId: string, toStatusId: string) => {
    if (!card) {
      return;
    }

    transitionCard(
      { id: card.id, data: { transitionId }, toStatusId },
      {
        onSuccess: () => {
          notifications.show({
            title: "Muvaffaqiyatli",
            message: "Vazifa statusi o'zgartirildi",
            color: "green",
          });
          onSuccess?.();
        },
        onError: (error) => {
          notifications.show({
            title: isConflictError(error) ? "O'tish rad etildi" : "Xatolik",
            message: getErrorMessage(
              error,
              "Vazifa statusini o'zgartirib bo'lmadi",
            ),
            color: "red",
          });
        },
      },
    );
  };

  const handleSubmit = (values: CardFormValues) => {
    // Backend rejects statuses that aren't mapped to the card's column
    if (
      !usesTransitions &&
      values.statusId &&
      columnStatuses &&
      !columnStatuses.some((item) => item.statusId === values.statusId)
    ) {
      form.setFieldError("statusId", "Ushbu status ustunga biriktirilmagan");
      return;
    }

    const data = {
      ...values,
      description: values.description.trim() || null,
      // Unset -> backend picks the default status for the column. With a
      // workflow, status changes go through the transition actions instead
      statusId: usesTransitions ? undefined : (values.statusId ?? undefined),
    };

    if (card) {
      updateCard(
        { id: card.id, data },
        {
          onSuccess: () => {
            notifications.show({
              title: "Muvaffaqiyatli",
              message: "Vazifa yangilandi",
              color: "green",
            });
            onSuccess?.();
          },
          onError: handleError,
        },
      );
      return;
    }

    createCard(
      {
        ...data,
        columnId,
        order: nextOrder,
        assignerId: user?.id ?? null,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
        onError: handleError,
      },
    );
  };

  const handleDelete = () => {
    if (!card) {
      return;
    }

    if (!window.confirm(`"${card.title}" vazifasini o'chirishni xohlaysizmi?`)) {
      return;
    }

    deleteCard(card.id, {
      onSuccess: () => {
        notifications.show({
          title: "Muvaffaqiyatli",
          message: "Vazifa o'chirildi",
          color: "green",
        });
        onSuccess?.();
      },
      onError: (error) => {
        notifications.show({
          title: "Xatolik",
          message: getErrorMessage(error, "Vazifani o'chirishda xatolik"),
          color: "red",
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Vazifa nomi"
          placeholder="Vazifa nomini kiriting"
          data-autofocus
          required
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Tavsif"
          placeholder="Vazifa haqida batafsil"
          minRows={3}
          autosize
          {...form.getInputProps("description")}
        />

        {!card && hasNoWorkflowStatuses ? (
          <Alert color="orange" icon={<TriangleAlert size={16} />}>
            Ushbu ustun statuslari loyiha workflowiga kiritilmagan. Vazifa
            yaratish uchun ularni workflowga qo'shing.
          </Alert>
        ) : null}

        {!card && hasNoStatuses ? (
          <Alert color="orange" icon={<TriangleAlert size={16} />}>
            Ushbu ustunga status biriktirilmagan. Vazifa yaratish uchun avval
            ustunga status biriktiring.
          </Alert>
        ) : null}

        <Group grow align="flex-start">
          {usesTransitions ? (
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Holati
              </Text>
              <Badge
                variant="dot"
                size="lg"
                color={currentStatus?.color || "gray"}
              >
                {currentStatus?.name ?? "Noma'lum status"}
              </Badge>
            </Stack>
          ) : (
            <Select
              label="Holati"
              placeholder="Standart status"
              data={selectableStatuses.map(({ status }) => ({
                value: status.id,
                label: status.name,
              }))}
              allowDeselect={false}
              // Options depend on the workflow, so wait for it
              disabled={isWorkflowLoading}
              nothingFoundMessage="Ustunga status biriktirilmagan"
              {...form.getInputProps("statusId")}
            />
          )}

          <NumberInput
            label="Ball"
            min={0}
            allowDecimal={false}
            allowNegative={false}
            {...form.getInputProps("points")}
          />
        </Group>

        {usesTransitions && canEdit ? (
          <Stack gap={6}>
            <Text size="sm" fw={500}>
              O'tkazish
            </Text>

            {isMappingsLoading ? (
              <Loader size="xs" />
            ) : transitionActions.length > 0 ? (
              <Group gap="xs">
                {transitionActions.map(
                  ({ transition, status, targetColumnId }) => (
                    <Tooltip
                      key={transition.id}
                      label={`"${columnById.get(targetColumnId)?.name ?? ""}" ustuniga o'tadi`}
                      disabled={targetColumnId === card?.columnId}
                    >
                      <Button
                        size="xs"
                        variant="light"
                        color={status.color || "gray"}
                        leftSection={<ArrowRight size={14} />}
                        loading={
                          isTransitioning &&
                          transitionVariables?.data.transitionId ===
                            transition.id
                        }
                        disabled={isTransitioning}
                        onClick={() =>
                          handleTransition(transition.id, status.id)
                        }
                      >
                        {status.name}
                      </Button>
                    </Tooltip>
                  ),
                )}
              </Group>
            ) : (
              <Text size="xs" c="dimmed">
                Workflow bo'yicha joriy statusdan o'tishlar yo'q
              </Text>
            )}
          </Stack>
        ) : null}

        <Select
          label="Ijrochi"
          placeholder="Foydalanuvchini tanlang"
          data={(users ?? []).map((u) => ({
            value: u.id,
            label: u.name || u.email,
          }))}
          searchable
          clearable
          nothingFoundMessage="Foydalanuvchi topilmadi"
          {...form.getInputProps("assigneeId")}
        />

        <Group justify={card && canDelete ? "space-between" : "flex-end"}>
          {card && canDelete ? (
            <Button
              variant="light"
              color="red"
              leftSection={<Trash2 size={16} />}
              onClick={handleDelete}
              loading={isDeleting}
            >
              O'chirish
            </Button>
          ) : null}

          <Button
            type="submit"
            loading={isCreating || isUpdating}
            disabled={
              card ? !canEdit : hasNoStatuses || hasNoWorkflowStatuses
            }
          >
            {card ? "Saqlash" : "Yaratish"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
