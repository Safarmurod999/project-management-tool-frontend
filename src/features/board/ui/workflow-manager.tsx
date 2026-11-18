import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Center,
  CloseButton,
  Group,
  Loader,
  Modal,
  MultiSelect,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowRightLeft,
  Edit,
  Info,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import {
  groupTransitions,
  hasRule,
  isSameRule,
  type Status,
  type TransitionGroup,
  type TransitionRule,
  type WorkflowDetails,
} from "@/entities/board";
import { Access, useAccess } from "@/entities/user";
import { createZodValidator } from "@/shared/lib";
import { getErrorMessage } from "../model/get-error-message";
import {
  createWorkflowSchema,
  workflowTransitionSchema,
} from "../model/schema";
import { useProjectStatuses } from "../model/use-board";
import {
  useProjectWorkflow,
  useWorkflowCreate,
  useWorkflowStatusAdd,
  useWorkflowStatusRemove,
  useWorkflowTransitionCreate,
  useWorkflowTransitionDelete,
  useWorkflowTransitionUpdate,
} from "../model/use-workflow";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

const showError = (error: unknown, fallback: string) => {
  notifications.show({
    title: "Xatolik",
    message: getErrorMessage(error, fallback),
    color: "red",
  });
};

const showSuccess = (message: string) => {
  notifications.show({ title: "Muvaffaqiyatli", message, color: "green" });
};

/** The rules a transition group stands for */
const groupRules = (group: TransitionGroup) =>
  group.backward ? [group.forward, group.backward] : [group.forward];

type WorkflowModal =
  | { mode: "create-workflow" }
  | { mode: "transition"; group?: TransitionGroup };

interface WorkflowManagerProps {
  projectId: string;
}

/**
 * Manages the project's default workflow: which statuses cards may use and
 * which status changes are allowed. Statuses themselves are managed by
 * StatusManager; columns map them on the board.
 */
export function WorkflowManager({ projectId }: WorkflowManagerProps) {
  const canRead = useAccess(Access.WORKFLOW_GET);
  const canCreate = useAccess(Access.WORKFLOW_CREATE);
  const canEdit = useAccess(Access.WORKFLOW_EDIT);

  const {
    data: workflow,
    isLoading,
    isError,
    refetch,
  } = useProjectWorkflow(projectId);
  const {
    data: projectStatuses,
    isLoading: isStatusesLoading,
    isError: isStatusesError,
  } = useProjectStatuses(projectId);

  const [modal, setModal] = useState<WorkflowModal | null>(null);

  const renderContent = () => {
    if (!canRead) {
      return (
        <Text ta="center" c="dimmed" size="sm" py="md">
          Workflowni ko'rish uchun ruxsat yo'q (workflow:get). Administratorga
          murojaat qiling.
        </Text>
      );
    }

    if (isLoading) {
      return (
        <Center py="md">
          <Loader size="sm" />
        </Center>
      );
    }

    if (isError) {
      return (
        <Stack gap="xs" align="center">
          <Text ta="center" c="red" size="sm">
            Workflowni yuklashda xatolik yuz berdi
          </Text>
          <Button size="xs" variant="light" onClick={() => refetch()}>
            Qayta urinish
          </Button>
        </Stack>
      );
    }

    if (!workflow) {
      const hasStatuses = (projectStatuses?.length ?? 0) > 0;

      return (
        <Stack gap="sm" align="center" py="md">
          <Text ta="center" c="dimmed" size="sm">
            Loyihada workflow yo'q, vazifa statuslari cheklanmagan.
          </Text>

          {!canCreate ? (
            <Text ta="center" c="dimmed" size="xs">
              Workflow yaratish uchun ruxsat yo'q (workflow:create)
            </Text>
          ) : isStatusesError ? (
            <Text ta="center" c="red" size="xs">
              Loyiha statuslarini yuklab bo'lmadi
            </Text>
          ) : !isStatusesLoading && !hasStatuses ? (
            <Text ta="center" c="dimmed" size="xs">
              Workflow yaratish uchun avval yuqorida loyiha statuslarini
              yarating
            </Text>
          ) : (
            <Button
              variant="light"
              leftSection={<Plus size={16} />}
              loading={isStatusesLoading}
              onClick={() => setModal({ mode: "create-workflow" })}
            >
              Workflow yaratish
            </Button>
          )}
        </Stack>
      );
    }

    return (
      <WorkflowContent
        workflow={workflow}
        projectStatuses={projectStatuses ?? []}
        canEdit={canEdit}
        onAddTransition={() => setModal({ mode: "transition" })}
        onEditTransition={(group) => setModal({ mode: "transition", group })}
      />
    );
  };

  return (
    <Card withBorder radius="md">
      <Stack gap="md">
        <Stack gap={2}>
          <Text fw={600} size="lg">
            Workflow
          </Text>

          <Text size="sm" c="dimmed">
            Vazifa statuslari orasidagi ruxsat etilgan o'tishlar
          </Text>
        </Stack>

        {renderContent()}
      </Stack>

      <Modal
        opened={Boolean(modal)}
        onClose={() => setModal(null)}
        size={modal?.mode === "create-workflow" ? "lg" : "md"}
        title={
          modal?.mode === "create-workflow"
            ? "Yangi workflow"
            : modal?.group
              ? "O'tishni tahrirlash"
              : "Yangi o'tish"
        }
      >
        {modal?.mode === "create-workflow" ? (
          <CreateWorkflowForm
            projectId={projectId}
            statuses={projectStatuses ?? []}
            onSuccess={() => setModal(null)}
          />
        ) : modal?.mode === "transition" && workflow ? (
          <TransitionForm
            workflow={workflow}
            group={modal.group}
            onSuccess={() => setModal(null)}
          />
        ) : null}
      </Modal>
    </Card>
  );
}

interface WorkflowContentProps {
  workflow: WorkflowDetails;
  projectStatuses: Status[];
  canEdit: boolean;
  onAddTransition: () => void;
  onEditTransition: (group: TransitionGroup) => void;
}

function WorkflowContent({
  workflow,
  projectStatuses,
  canEdit,
  onAddTransition,
  onEditTransition,
}: WorkflowContentProps) {
  const { mutate: addStatus, isPending: isAdding } = useWorkflowStatusAdd(
    workflow.id,
  );
  const { mutate: removeStatus } = useWorkflowStatusRemove(workflow.id);
  const { mutateAsync: deleteTransition } = useWorkflowTransitionDelete(
    workflow.id,
  );

  const [statusToAdd, setStatusToAdd] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const statuses = [...workflow.statuses].sort(byOrder);
  const statusById = new Map(statuses.map((status) => [status.id, status]));
  const availableStatuses = projectStatuses.filter(
    (status) => !statusById.has(status.id),
  );
  const groups = groupTransitions(workflow.transitions);

  const handleAddStatus = () => {
    if (!statusToAdd) {
      return;
    }

    addStatus(
      { statusId: statusToAdd },
      {
        onSuccess: () => {
          setStatusToAdd(null);
          showSuccess("Status workflowga qo'shildi");
        },
        onError: (error) => showError(error, "Statusni qo'shib bo'lmadi"),
      },
    );
  };

  const handleRemoveStatus = (status: Status) => {
    if (
      !window.confirm(
        `"${status.name}" statusini workflowdan olib tashlaysizmi? Unga bog'liq o'tishlar ham o'chiriladi.`,
      )
    ) {
      return;
    }

    removeStatus(status.id, {
      onSuccess: () => showSuccess("Status workflowdan olib tashlandi"),
      onError: (error) =>
        showError(error, "Statusni workflowdan olib tashlab bo'lmadi"),
    });
  };

  const handleDeleteGroup = async (group: TransitionGroup) => {
    if (!window.confirm("Ushbu o'tishni o'chirishni xohlaysizmi?")) {
      return;
    }

    setDeletingKey(group.key);
    try {
      // A two-way transition is two rules on the backend
      for (const rule of groupRules(group)) {
        await deleteTransition(rule.id);
      }
      showSuccess("O'tish o'chirildi");
    } catch (error) {
      showError(error, "O'tishni o'chirib bo'lmadi");
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <Stack gap="lg">
      <Group gap="xs">
        <Text fw={500}>{workflow.name}</Text>
        {workflow.isDefault ? (
          <Badge size="xs" variant="light">
            Standart
          </Badge>
        ) : null}
      </Group>

      {workflow.description ? (
        <Text size="sm" c="dimmed" mt={-12}>
          {workflow.description}
        </Text>
      ) : null}

      <Stack gap="xs">
        <Text fw={500} size="sm">
          Statuslar
        </Text>

        {statuses.length > 0 ? (
          <Group gap="xs">
            {statuses.map((status) => (
              <Badge
                key={status.id}
                variant="dot"
                color={status.color || "gray"}
                rightSection={
                  canEdit ? (
                    <CloseButton
                      size="xs"
                      aria-label="Workflowdan olib tashlash"
                      onClick={() => handleRemoveStatus(status)}
                    />
                  ) : null
                }
              >
                {status.name}
              </Badge>
            ))}
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            Workflowga status qo'shilmagan
          </Text>
        )}

        {canEdit && availableStatuses.length > 0 ? (
          <Group gap="xs" align="flex-end">
            <Select
              placeholder="Status qo'shish"
              data={availableStatuses.map((status) => ({
                value: status.id,
                label: status.name,
              }))}
              value={statusToAdd}
              onChange={setStatusToAdd}
              size="xs"
              style={{ flex: 1, maxWidth: 260 }}
            />
            <Button
              size="xs"
              variant="light"
              onClick={handleAddStatus}
              disabled={!statusToAdd}
              loading={isAdding}
            >
              Qo'shish
            </Button>
          </Group>
        ) : null}
      </Stack>

      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={500} size="sm">
            O'tishlar
          </Text>

          {canEdit ? (
            <Tooltip
              label="Avval workflowga kamida ikkita status qo'shing"
              disabled={statuses.length >= 2}
            >
              <Button
                size="xs"
                leftSection={<Plus size={14} />}
                onClick={onAddTransition}
                disabled={statuses.length < 2}
              >
                O'tish qo'shish
              </Button>
            </Tooltip>
          ) : null}
        </Group>

        {groups.length > 0 ? (
          groups.map((group) => (
            <TransitionRow
              key={group.key}
              group={group}
              statusById={statusById}
              isDeleting={deletingKey === group.key}
              onEdit={canEdit ? () => onEditTransition(group) : undefined}
              onDelete={canEdit ? () => handleDeleteGroup(group) : undefined}
            />
          ))
        ) : (
          <Alert color="orange" icon={<TriangleAlert size={16} />}>
            O'tishlar yo'q, shuning uchun vazifa statusini o'zgartirib
            bo'lmaydi.
          </Alert>
        )}
      </Stack>
    </Stack>
  );
}

interface TransitionRowProps {
  group: TransitionGroup;
  statusById: Map<string, Status>;
  isDeleting: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TransitionRow({
  group,
  statusById,
  isDeleting,
  onEdit,
  onDelete,
}: TransitionRowProps) {
  const isTwoWay = Boolean(group.backward);
  const from = statusById.get(group.forward.fromStatusId);
  const to = statusById.get(group.forward.toStatusId);

  return (
    <Card withBorder radius="sm" p="xs">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          <StatusBadge status={from} />

          {isTwoWay ? (
            <ArrowLeftRight size={16} color="var(--mantine-color-blue-6)" />
          ) : (
            <ArrowRight size={16} color="var(--mantine-color-dimmed)" />
          )}

          <StatusBadge status={to} />

          <Badge size="xs" variant="light" color={isTwoWay ? "blue" : "gray"}>
            {isTwoWay ? "Ikki tomonlama" : "Bir tomonlama"}
          </Badge>
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
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={onDelete}
                loading={isDeleting}
              >
                <Trash2 size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </Group>
      </Group>
    </Card>
  );
}

function StatusBadge({ status }: { status?: Status }) {
  return (
    <Badge variant="dot" color={status?.color || "gray"}>
      {status?.name ?? "Noma'lum status"}
    </Badge>
  );
}

type TransitionFormValues = {
  fromStatusId: string | null;
  toStatusId: string | null;
  bidirectional: boolean;
};

interface TransitionFormProps {
  workflow: WorkflowDetails;
  /** Transition being edited; omit to create a new one */
  group?: TransitionGroup;
  onSuccess?: () => void;
}

function TransitionForm({ workflow, group, onSuccess }: TransitionFormProps) {
  const { mutateAsync: createTransition } = useWorkflowTransitionCreate(
    workflow.id,
  );
  const { mutateAsync: updateTransition } = useWorkflowTransitionUpdate(
    workflow.id,
  );
  const { mutateAsync: deleteTransition } = useWorkflowTransitionDelete(
    workflow.id,
  );
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<TransitionFormValues>({
    initialValues: {
      fromStatusId: group?.forward.fromStatusId ?? null,
      toStatusId: group?.forward.toStatusId ?? null,
      bidirectional: Boolean(group?.backward),
    },
    validate: createZodValidator(workflowTransitionSchema),
  });

  const statuses = [...workflow.statuses].sort(byOrder);
  const statusName = (id: string) =>
    statuses.find((status) => status.id === id)?.name ?? "?";

  const { fromStatusId, toStatusId, bidirectional } = form.values;
  const existing = group ? groupRules(group) : [];
  // Rules of the edited transition are replaced, so they can't conflict
  const others = workflow.transitions.filter(
    (transition) => !existing.some((rule) => rule.id === transition.id),
  );

  const desired: TransitionRule[] =
    fromStatusId && toStatusId && fromStatusId !== toStatusId
      ? [
          { fromStatusId, toStatusId },
          ...(bidirectional
            ? [{ fromStatusId: toStatusId, toStatusId: fromStatusId }]
            : []),
        ]
      : [];

  const duplicate = desired.find((rule) => hasRule(others, rule));
  // An existing opposite one-way rule merges with a new one into a two-way transition
  const reverseExists =
    !bidirectional &&
    !duplicate &&
    desired.length > 0 &&
    hasRule(others, {
      fromStatusId: desired[0].toStatusId,
      toStatusId: desired[0].fromStatusId,
    });
  const isUnchanged =
    desired.length === existing.length &&
    desired.every((rule) => hasRule(existing, rule));

  const handleSubmit = async (values: TransitionFormValues) => {
    if (duplicate || !values.fromStatusId || !values.toStatusId) {
      return;
    }

    setIsSaving(true);
    try {
      if (!group) {
        await createTransition({
          fromStatusId: values.fromStatusId,
          toStatusId: values.toStatusId,
          bidirectional: values.bidirectional,
        });
      } else {
        const toCreate = desired.filter((rule) => !hasRule(existing, rule));
        const toReplace = existing.filter(
          (rule) => !desired.some((item) => isSameRule(item, rule)),
        );

        // Reuse outdated rules first; none of them equals a desired rule, so
        // the updates can't collide with each other
        for (const [index, rule] of toCreate.entries()) {
          const replaced = toReplace[index];
          if (replaced) {
            await updateTransition({ transitionId: replaced.id, data: rule });
          } else {
            await createTransition(rule);
          }
        }

        for (const rule of toReplace.slice(toCreate.length)) {
          await deleteTransition(rule.id);
        }
      }

      showSuccess(group ? "O'tish yangilandi" : "O'tish yaratildi");
      onSuccess?.();
    } catch (error) {
      showError(error, "O'tishni saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwap = () => {
    form.setValues({ fromStatusId: toStatusId, toStatusId: fromStatusId });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <SegmentedControl
          fullWidth
          data={[
            { value: "one-way", label: "Bir tomonlama" },
            { value: "two-way", label: "Ikki tomonlama" },
          ]}
          value={bidirectional ? "two-way" : "one-way"}
          onChange={(value) =>
            form.setFieldValue("bidirectional", value === "two-way")
          }
        />

        <Group gap="xs" align="flex-start" wrap="nowrap">
          <Select
            label="Qaysi statusdan"
            placeholder="Statusni tanlang"
            data={statuses.map((status) => ({
              value: status.id,
              label: status.name,
            }))}
            allowDeselect={false}
            required
            style={{ flex: 1 }}
            {...form.getInputProps("fromStatusId")}
          />

          <Tooltip label="Yo'nalishni almashtirish">
            <ActionIcon
              variant="subtle"
              color="gray"
              mt={28}
              onClick={handleSwap}
              aria-label="Yo'nalishni almashtirish"
            >
              {bidirectional ? (
                <ArrowLeftRight size={16} />
              ) : (
                <ArrowRightLeft size={16} />
              )}
            </ActionIcon>
          </Tooltip>

          <Select
            label="Qaysi statusga"
            placeholder="Statusni tanlang"
            data={statuses.map((status) => ({
              value: status.id,
              label: status.name,
              disabled: status.id === fromStatusId,
            }))}
            allowDeselect={false}
            required
            style={{ flex: 1 }}
            {...form.getInputProps("toStatusId")}
          />
        </Group>

        {duplicate ? (
          <Alert color="red" icon={<TriangleAlert size={16} />}>
            "{statusName(duplicate.fromStatusId)} →{" "}
            {statusName(duplicate.toStatusId)}" o'tishi allaqachon mavjud.
            Mavjud o'tishni tahrirlang.
          </Alert>
        ) : desired.length > 0 ? (
          <Alert color="blue" icon={<Info size={16} />}>
            {desired
              .map(
                (rule) =>
                  `${statusName(rule.fromStatusId)} → ${statusName(rule.toStatusId)}`,
              )
              .join(", ")}
            {reverseExists
              ? ". Teskari yo'nalish mavjud, natijada o'tish ikki tomonlama bo'ladi."
              : null}
          </Alert>
        ) : null}

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isSaving}
            disabled={Boolean(duplicate) || (Boolean(group) && isUnchanged)}
          >
            {group ? "Saqlash" : "Yaratish"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

/** A transition being drafted in the create form, before it has an id */
type DraftTransition = {
  key: string;
  fromStatusId: string | null;
  toStatusId: string | null;
  bidirectional: boolean;
};

type CreateWorkflowFormValues = {
  name: string;
  description: string;
  statusIds: string[];
  transitions: DraftTransition[];
};

const createWorkflowFormSchema = createWorkflowSchema
  .pick({ name: true, description: true })
  .extend({
    // A workflow without statuses would block creating any card
    statusIds: z.array(z.string()).min(1, "Kamida bitta statusni tanlang"),
  });

/** The rules a draft stands for; empty while it is incomplete */
const draftRules = ({
  fromStatusId,
  toStatusId,
  bidirectional,
}: DraftTransition): TransitionRule[] =>
  fromStatusId && toStatusId && fromStatusId !== toStatusId
    ? [
        { fromStatusId, toStatusId },
        ...(bidirectional
          ? [{ fromStatusId: toStatusId, toStatusId: fromStatusId }]
          : []),
      ]
    : [];

/** Why a draft can't be saved; of two duplicates, the later one is flagged */
const getDraftError = (
  draft: DraftTransition,
  index: number,
  drafts: DraftTransition[],
  statusIds: string[],
): string | null => {
  const { fromStatusId, toStatusId } = draft;

  if (!fromStatusId || !toStatusId) {
    return "Ikkala statusni tanlang";
  }

  if (fromStatusId === toStatusId) {
    return "Statuslar bir xil bo'lishi mumkin emas";
  }

  if (!statusIds.includes(fromStatusId) || !statusIds.includes(toStatusId)) {
    return "Status workflow uchun tanlanmagan";
  }

  const earlier = drafts.slice(0, index).flatMap(draftRules);
  if (draftRules(draft).some((rule) => hasRule(earlier, rule))) {
    return "Bu o'tish allaqachon qo'shilgan";
  }

  return null;
};

interface CreateWorkflowFormProps {
  projectId: string;
  /** Existing project statuses; the workflow only references them */
  statuses: Status[];
  onSuccess?: () => void;
}

function CreateWorkflowForm({
  projectId,
  statuses,
  onSuccess,
}: CreateWorkflowFormProps) {
  const { mutate: createWorkflow, isPending } = useWorkflowCreate();

  const form = useForm<CreateWorkflowFormValues>({
    initialValues: {
      name: "",
      description: "",
      // Every project status by default; the user narrows it down
      statusIds: statuses.map((status) => status.id),
      transitions: [],
    },
    validate: createZodValidator(createWorkflowFormSchema),
  });

  const { statusIds, transitions } = form.values;
  const statusName = (id: string) =>
    statuses.find((status) => status.id === id)?.name ?? "?";
  // Transitions may only connect statuses selected for the workflow
  const selectedOptions = statuses
    .filter((status) => statusIds.includes(status.id))
    .map((status) => ({ value: status.id, label: status.name }));
  const draftErrors = transitions.map((draft, index) =>
    getDraftError(draft, index, transitions, statusIds),
  );
  const hasDraftErrors = draftErrors.some(Boolean);
  const rules = transitions.flatMap(draftRules);

  const handleAddDraft = () => {
    form.insertListItem("transitions", {
      key: randomId(),
      fromStatusId: null,
      toStatusId: null,
      bidirectional: false,
    } satisfies DraftTransition);
  };

  const handleSubmit = (values: CreateWorkflowFormValues) => {
    if (hasDraftErrors) {
      return;
    }

    createWorkflow(
      {
        projectId,
        name: values.name,
        description: values.description.trim() || null,
        // Keep the project's status order
        statusIds: statuses
          .filter((status) => values.statusIds.includes(status.id))
          .map((status) => status.id),
        transitions: values.transitions.flatMap(
          ({ fromStatusId, toStatusId, bidirectional }) =>
            fromStatusId && toStatusId
              ? [{ fromStatusId, toStatusId, bidirectional }]
              : [],
        ),
      },
      {
        onSuccess: () => {
          showSuccess("Workflow yaratildi");
          onSuccess?.();
        },
        onError: (error) =>
          showError(error, "Workflowni yaratishda xatolik yuz berdi"),
      },
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Workflow nomi"
          placeholder="Masalan: Asosiy jarayon"
          data-autofocus
          required
          {...form.getInputProps("name")}
        />

        <Textarea
          label="Tavsif"
          placeholder="Workflow haqida"
          minRows={2}
          autosize
          {...form.getInputProps("description")}
        />

        <MultiSelect
          label="Statuslar"
          description="Loyihaning mavjud statuslari tanlanadi, yangi status yaratilmaydi"
          placeholder="Statuslarni tanlang"
          data={statuses.map((status) => ({
            value: status.id,
            label: status.name,
          }))}
          searchable
          required
          {...form.getInputProps("statusIds")}
        />

        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500} size="sm">
              O'tishlar
            </Text>

            <Tooltip
              label="Avval kamida ikkita status tanlang"
              disabled={selectedOptions.length >= 2}
            >
              <Button
                size="xs"
                variant="light"
                leftSection={<Plus size={14} />}
                onClick={handleAddDraft}
                disabled={selectedOptions.length < 2}
              >
                O'tish qo'shish
              </Button>
            </Tooltip>
          </Group>

          {transitions.length > 0 ? (
            transitions.map((draft, index) => (
              <Card key={draft.key} withBorder radius="sm" p="xs">
                <Stack gap={6}>
                  <Group gap="xs" wrap="nowrap" align="center">
                    <Select
                      size="xs"
                      placeholder="Qaysi statusdan"
                      aria-label="Qaysi statusdan"
                      data={selectedOptions}
                      allowDeselect={false}
                      style={{ flex: 1 }}
                      {...form.getInputProps(
                        `transitions.${index}.fromStatusId`,
                      )}
                    />

                    <Tooltip
                      label={
                        draft.bidirectional
                          ? "Ikki tomonlama (bosing: bir tomonlama)"
                          : "Bir tomonlama (bosing: ikki tomonlama)"
                      }
                    >
                      <ActionIcon
                        variant={draft.bidirectional ? "light" : "subtle"}
                        color={draft.bidirectional ? "blue" : "gray"}
                        aria-label="Yo'nalish turini almashtirish"
                        onClick={() =>
                          form.setFieldValue(
                            `transitions.${index}.bidirectional`,
                            !draft.bidirectional,
                          )
                        }
                      >
                        {draft.bidirectional ? (
                          <ArrowLeftRight size={16} />
                        ) : (
                          <ArrowRight size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>

                    <Select
                      size="xs"
                      placeholder="Qaysi statusga"
                      aria-label="Qaysi statusga"
                      data={selectedOptions.map((option) => ({
                        ...option,
                        disabled: option.value === draft.fromStatusId,
                      }))}
                      allowDeselect={false}
                      style={{ flex: 1 }}
                      {...form.getInputProps(`transitions.${index}.toStatusId`)}
                    />

                    <CloseButton
                      size="sm"
                      aria-label="O'tishni olib tashlash"
                      onClick={() => form.removeListItem("transitions", index)}
                    />
                  </Group>

                  {draftErrors[index] ? (
                    <Text size="xs" c="red">
                      {draftErrors[index]}
                    </Text>
                  ) : null}
                </Stack>
              </Card>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              O'tishlarni hozir yoki workflow yaratilgandan so'ng qo'shish
              mumkin
            </Text>
          )}

          {rules.length > 0 && !hasDraftErrors ? (
            <Alert color="blue" icon={<Info size={16} />}>
              {rules
                .map(
                  (rule) =>
                    `${statusName(rule.fromStatusId)} → ${statusName(rule.toStatusId)}`,
                )
                .join(", ")}
            </Alert>
          ) : null}
        </Stack>

        <Alert color="orange" icon={<TriangleAlert size={16} />}>
          Workflow yaratilgach, vazifa statusini faqat belgilangan o'tishlar
          bo'yicha o'zgartirish mumkin bo'ladi. Boardlar, ustunlar va ularga
          biriktirilgan statuslar o'zgarmaydi.
        </Alert>

        <Group justify="flex-end">
          <Button type="submit" loading={isPending} disabled={hasDraftErrors}>
            Yaratish
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
