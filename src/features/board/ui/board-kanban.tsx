import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Menu,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, MoreHorizontal, Plus, Star, Trash2 } from "lucide-react";
import { useViewportSize } from "@mantine/hooks";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type BoardCard,
  type BoardColumn,
  type ColumnStatus,
  isTransitionAllowed,
  type Status,
} from "@/entities/board";
import { Access, type User, useAccess } from "@/entities/user";
import { useUsers } from "@/features/users/model/use-user";
import { useSearchParams } from "react-router-dom";
import { cardApi, type ReorderCardPayload } from "@/shared/api/card";
import { getErrorMessage, isConflictError } from "../model/get-error-message";
import {
  useBoardCards,
  useBoardColumnStatuses,
  useCardReorder,
  useColumnDelete,
  useColumns,
  useProjectStatuses,
} from "../model/use-board";
import { useProjectWorkflow } from "../model/use-workflow";
import { CardForm } from "./card-form";
import { ColumnForm } from "./column-form";

type CardsByColumn = Record<string, BoardCard[]>;

// Column droppable ids are prefixed so they never collide with card ids
const COLUMN_PREFIX = "column:";
// Space kept below the columns: board scrollbar + page padding
const BOARD_BOTTOM_GAP = 40;
const MIN_COLUMN_HEIGHT = 240;
const toColumnDndId = (columnId: string) => `${COLUMN_PREFIX}${columnId}`;

type ColumnModal = { mode: "create" } | { mode: "edit"; column: BoardColumn };
type CardMove = Omit<ReorderCardPayload, "statusId">;
/** Cross-column move waiting for the user to pick one of the allowed target statuses */
type PendingMove = CardMove & { statuses: ColumnStatus[] };
type CardModal =
  | { mode: "create"; columnId: string }
  | { mode: "edit"; card: BoardCard };

interface BoardKanbanProps {
  boardId: string;
  /** Statuses are project-scoped, so the board's project is needed to resolve them */
  projectId: string;
}

export function BoardKanban({ boardId, projectId }: BoardKanbanProps) {
  const { data: columns, isLoading: isColumnsLoading } = useColumns(boardId);
  const { data: cards, isLoading: isCardsLoading } = useBoardCards(
    boardId,
    columns,
  );
  const { data: users } = useUsers();
  const { data: statuses } = useProjectStatuses(projectId);
  const statusesByColumn = useBoardColumnStatuses(columns);
  // null: no workflow (unrestricted); undefined: unknown, so the backend decides
  const { data: workflow } = useProjectWorkflow(projectId);
  const canCreateColumn = useAccess(Access.COLUMN_CREATE);
  const { mutate: reorderCard } = useCardReorder(boardId);
  const { mutate: deleteColumn } = useColumnDelete(boardId);

  const [items, setItems] = useState<CardsByColumn>({});
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);
  // True while a drag or its reorder request is in flight
  const [isLocalOrder, setIsLocalOrder] = useState(false);
  const dragSourceColumn = useRef<string | null>(null);

  const [columnModal, setColumnModal] = useState<ColumnModal | null>(null);
  const [cardModal, setCardModal] = useState<CardModal | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);

  // `?card=<id>` (links from the home page and notifications) opens that card
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedCardId = searchParams.get("card");

  useEffect(() => {
    if (!linkedCardId || !cards) {
      return;
    }

    const clearLink = () =>
      setSearchParams(
        (params) => {
          params.delete("card");
          return params;
        },
        { replace: true },
      );

    const loaded = Object.values(cards)
      .flat()
      .find((card) => card.id === linkedCardId);

    if (loaded) {
      setCardModal({ mode: "edit", card: loaded });
      clearLink();
      return;
    }

    // Not on a loaded page of its column (or moved away): fetch it directly
    let cancelled = false;
    cardApi
      .getById(linkedCardId)
      .then(({ data }) => {
        if (!cancelled) setCardModal({ mode: "edit", card: data });
      })
      .catch(() => {
        if (!cancelled)
          notifications.show({
            title: "Xatolik",
            message: "Vazifa topilmadi yoki o'chirilgan",
            color: "red",
          });
      })
      .finally(() => {
        if (!cancelled) clearLink();
      });

    return () => {
      cancelled = true;
    };
  }, [linkedCardId, cards, setSearchParams]);

  // Keep local ordering in sync with the server, except mid-drag
  useEffect(() => {
    if (cards && !isLocalOrder) {
      setItems(cards);
    }
  }, [cards, isLocalOrder]);

  // Columns fill the viewport below the board's top edge
  const boardRef = useRef<HTMLDivElement>(null);
  const { height: viewportHeight } = useViewportSize();
  const [boardTop, setBoardTop] = useState(0);

  const isBoardLoading =
    isColumnsLoading || (!!columns && columns.length > 0 && isCardsLoading);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the viewport resizes or the board mounts after loading
  useLayoutEffect(() => {
    if (boardRef.current) {
      setBoardTop(
        boardRef.current.getBoundingClientRect().top + window.scrollY,
      );
    }
  }, [viewportHeight, isBoardLoading]);

  const columnMaxHeight = Math.max(
    viewportHeight - boardTop - BOARD_BOTTOM_GAP,
    MIN_COLUMN_HEIGHT,
  );

  const usersById = useMemo(
    () => new Map((users ?? []).map((u) => [u.id, u])),
    [users],
  );

  const statusesById = useMemo(
    () => new Map((statuses ?? []).map((status) => [status.id, status])),
    [statuses],
  );

  // Append after the highest existing order so gaps from deleted columns don't cause duplicates
  const nextColumnOrder =
    columns && columns.length > 0
      ? Math.max(...columns.map((column) => column.order)) + 1
      : 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /**
   * Target column statuses the card may move to: mapped to the column and,
   * with a workflow, reachable from its current status. Only narrows the
   * choice offered to the user; the backend still validates the move.
   * Undefined while the column's mappings are loading.
   */
  const getAllowedStatuses = (columnId: string, card: BoardCard) =>
    statusesByColumn[columnId]?.filter((mapping) =>
      isTransitionAllowed(workflow, card.statusId, mapping.statusId),
    );

  const findColumnId = (id: string): string | undefined => {
    if (id.startsWith(COLUMN_PREFIX)) {
      return id.slice(COLUMN_PREFIX.length);
    }

    return Object.keys(items).find((columnId) =>
      items[columnId].some((card) => card.id === id),
    );
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const columnId = findColumnId(String(active.id));
    dragSourceColumn.current = columnId ?? null;
    setIsLocalOrder(true);
    setActiveCard(
      columnId
        ? (items[columnId].find((card) => card.id === active.id) ?? null)
        : null,
    );
  };

  // Moves the dragged card into another column while hovering it
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      return;
    }

    const fromColumn = findColumnId(String(active.id));
    const toColumn = findColumnId(String(over.id));

    if (!fromColumn || !toColumn || fromColumn === toColumn) {
      return;
    }

    setItems((prev) => {
      const fromCards = prev[fromColumn];
      const toCards = prev[toColumn] ?? [];
      const moving = fromCards.find((card) => card.id === active.id);

      if (!moving) {
        return prev;
      }

      const overIndex = toCards.findIndex((card) => card.id === over.id);
      const insertAt = overIndex >= 0 ? overIndex : toCards.length;

      return {
        ...prev,
        [fromColumn]: fromCards.filter((card) => card.id !== active.id),
        [toColumn]: [
          ...toCards.slice(0, insertAt),
          { ...moving, columnId: toColumn },
          ...toCards.slice(insertAt),
        ],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const sourceColumnId = dragSourceColumn.current;
    const cardId = String(active.id);
    // Captured at drag start, so it still has the card's original status
    const movingCard = activeCard;

    dragSourceColumn.current = null;

    const targetColumnId = over ? findColumnId(String(over.id)) : undefined;

    if (!over || !sourceColumnId || !targetColumnId) {
      handleDragCancel();
      return;
    }

    const targetCards = items[targetColumnId];
    const oldIndex = targetCards.findIndex((card) => card.id === cardId);
    const overIndex = targetCards.findIndex((card) => card.id === over.id);
    const newIndex = overIndex >= 0 ? overIndex : targetCards.length - 1;

    const originalIndex = (cards?.[sourceColumnId] ?? []).findIndex(
      (card) => card.id === cardId,
    );

    if (oldIndex !== newIndex) {
      setItems((prev) => ({
        ...prev,
        [targetColumnId]: arrayMove(prev[targetColumnId], oldIndex, newIndex),
      }));
    }

    setActiveCard(null);

    if (sourceColumnId === targetColumnId && originalIndex === newIndex) {
      setIsLocalOrder(false);
      return;
    }

    const move: CardMove = { cardId, sourceColumnId, targetColumnId, newIndex };

    // Reordering within a column never changes the status
    if (sourceColumnId === targetColumnId) {
      commitMove(move);
      return;
    }

    // The status always comes from the target column's mappings, never its name
    const targetStatuses = statusesByColumn[targetColumnId];

    if (!targetStatuses || !movingCard) {
      // Mappings not loaded yet: let the backend resolve a valid status
      commitMove(move);
      return;
    }

    if (targetStatuses.length === 0) {
      notifications.show({
        title: "Xatolik",
        message: "Ushbu ustunga status biriktirilmagan, vazifani ko'chirib bo'lmaydi",
        color: "red",
      });
      handleDragCancel();
      return;
    }

    // Rules unknown (still loading, or no workflow:get): offering every mapped
    // status could suggest unreachable ones, so the backend picks a reachable one
    if (workflow === undefined) {
      commitMove(move);
      return;
    }

    const allowedStatuses =
      getAllowedStatuses(targetColumnId, movingCard) ?? [];

    if (allowedStatuses.length === 0) {
      notifications.show({
        title: "O'tish mumkin emas",
        message:
          "Workflow bo'yicha vazifani joriy statusidan ushbu ustun statuslariga o'tkazib bo'lmaydi",
        color: "orange",
      });
      // Restores the server order, putting the card back
      handleDragCancel();
      return;
    }

    if (allowedStatuses.length === 1) {
      commitMove(move, allowedStatuses[0].statusId);
      return;
    }

    // Local order stays applied while the user picks a status
    setPendingMove({ ...move, statuses: allowedStatuses });
  };

  const commitMove = (move: CardMove, statusId?: string) => {
    if (statusId) {
      // Optimistic: show the new status right away; rolled back by the resync below on error
      setItems((prev) => ({
        ...prev,
        [move.targetColumnId]: (prev[move.targetColumnId] ?? []).map((card) =>
          card.id === move.cardId ? { ...card, statusId } : card,
        ),
      }));
    }

    reorderCard(
      { ...move, statusId },
      {
        onError: (error) => {
          notifications.show({
            title: isConflictError(error) ? "O'tish rad etildi" : "Xatolik",
            message: getErrorMessage(error, "Vazifani ko'chirib bo'lmadi"),
            color: "red",
          });
        },
        // Runs after the refetch, so the server order replaces the local one
        onSettled: () => setIsLocalOrder(false),
      },
    );
  };

  const handleSelectMoveStatus = (statusId: string) => {
    if (pendingMove) {
      const { statuses: _statuses, ...move } = pendingMove;
      commitMove(move, statusId);
    }
    setPendingMove(null);
  };

  const handleCancelMove = () => {
    setPendingMove(null);
    handleDragCancel();
  };

  const handleDragCancel = () => {
    dragSourceColumn.current = null;
    setActiveCard(null);
    setIsLocalOrder(false);
  };

  const handleDeleteColumn = (column: BoardColumn) => {
    const count = items[column.id]?.length ?? 0;
    const warning =
      count > 0 ? ` Ustundagi ${count} ta vazifa ham o'chiriladi.` : "";

    if (
      !window.confirm(
        `"${column.name}" ustunini o'chirishni xohlaysizmi?${warning}`,
      )
    ) {
      return;
    }

    deleteColumn(column.id, {
      onError: (error) => {
        notifications.show({
          title: "Xatolik",
          message: getErrorMessage(error, "Ustunni o'chirib bo'lmadi"),
          color: "red",
        });
      },
    });
  };

  if (isBoardLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <ScrollArea ref={boardRef} type="auto" offsetScrollbars>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Group align="flex-start" wrap="nowrap" gap="md" pb="md">
            {columns?.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={items[column.id] ?? []}
                columnStatuses={statusesByColumn[column.id]}
                isBlocked={
                  !!activeCard &&
                  column.id !== activeCard.columnId &&
                  getAllowedStatuses(column.id, activeCard)?.length === 0
                }
                usersById={usersById}
                statusesById={statusesById}
                maxHeight={columnMaxHeight}
                onAddCard={() =>
                  setCardModal({ mode: "create", columnId: column.id })
                }
                onOpenCard={(card) => setCardModal({ mode: "edit", card })}
                onEdit={() => setColumnModal({ mode: "edit", column })}
                onDelete={() => handleDeleteColumn(column)}
              />
            ))}

            {canCreateColumn ? (
              <Button
                variant="default"
                leftSection={<Plus size={16} />}
                w={280}
                style={{ flexShrink: 0 }}
                radius="md"
                onClick={() => setColumnModal({ mode: "create" })}
              >
                Ustun qo'shish
              </Button>
            ) : null}
          </Group>

          <DragOverlay>
            {activeCard ? (
              <KanbanCardContent
                card={activeCard}
                assignee={
                  activeCard.assigneeId
                    ? usersById.get(activeCard.assigneeId)
                    : undefined
                }
                status={statusesById.get(activeCard.statusId)}
                dragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </ScrollArea>

      <Modal
        opened={Boolean(columnModal)}
        onClose={() => setColumnModal(null)}
        title={
          columnModal?.mode === "edit" ? "Ustunni tahrirlash" : "Yangi ustun"
        }
      >
        {columnModal ? (
          <ColumnForm
            boardId={boardId}
            projectId={projectId}
            columns={columns ?? []}
            statusesByColumn={statusesByColumn}
            column={columnModal.mode === "edit" ? columnModal.column : undefined}
            nextOrder={nextColumnOrder}
            onSuccess={() => setColumnModal(null)}
          />
        ) : null}
      </Modal>

      <Modal
        opened={Boolean(cardModal)}
        onClose={() => setCardModal(null)}
        title={cardModal?.mode === "edit" ? "Vazifa" : "Yangi vazifa"}
        size="lg"
      >
        {cardModal ? (
          <CardForm
            boardId={boardId}
            projectId={projectId}
            columns={columns ?? []}
            statusesByColumn={statusesByColumn}
            columnId={
              cardModal.mode === "edit"
                ? cardModal.card.columnId
                : cardModal.columnId
            }
            card={cardModal.mode === "edit" ? cardModal.card : undefined}
            nextOrder={
              cardModal.mode === "create"
                ? (items[cardModal.columnId]?.length ?? 0)
                : undefined
            }
            onSuccess={() => setCardModal(null)}
          />
        ) : null}
      </Modal>

      <Modal
        opened={Boolean(pendingMove)}
        onClose={handleCancelMove}
        title="Statusni tanlang"
        size="sm"
      >
        <Stack gap="xs">
          <Text size="sm" c="dimmed">
            Vazifani ushbu ustundagi bir nechta statusga o'tkazish mumkin.
            Birini tanlang.
          </Text>

          {pendingMove?.statuses.map(({ status }) => (
            <Button
              key={status.id}
              variant="light"
              color={status.color || "gray"}
              justify="flex-start"
              onClick={() => handleSelectMoveStatus(status.id)}
            >
              {status.name}
            </Button>
          ))}

          <Button variant="default" onClick={handleCancelMove}>
            Bekor qilish
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

interface KanbanColumnProps {
  column: BoardColumn;
  cards: BoardCard[];
  /** Undefined while the column's mappings are loading */
  columnStatuses?: ColumnStatus[];
  /** The dragged card can't reach any of this column's statuses */
  isBlocked: boolean;
  usersById: Map<string, User>;
  statusesById: Map<string, Status>;
  onAddCard: () => void;
  onOpenCard: (card: BoardCard) => void;
  onEdit: () => void;
  onDelete: () => void;
  maxHeight: number;
}

function KanbanColumn({
  column,
  cards,
  columnStatuses,
  isBlocked,
  usersById,
  statusesById,
  maxHeight,
  onAddCard,
  onOpenCard,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: toColumnDndId(column.id),
  });

  const canCreateCard = useAccess(Access.CARD_CREATE);
  // PATCH /cards/reorder requires card:edit
  const canMoveCard = useAccess(Access.CARD_EDIT);
  const canEditColumn = useAccess(Access.COLUMN_EDIT);
  const canDeleteColumn = useAccess(Access.COLUMN_DELETE);

  // Tracks whether the card list overflows, so the scrollbar gap is only added when needed
  const listRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  const setListRef = (node: HTMLDivElement | null) => {
    listRef.current = node;
    setNodeRef(node);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-check when cards or the height limit change
  useLayoutEffect(() => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    const check = () => setHasScroll(node.scrollHeight > node.clientHeight);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(node);

    return () => observer.disconnect();
  }, [cards, maxHeight]);

  return (
    <Card
      withBorder
      radius="lg"
      p="sm"
      w={280}
      mah={maxHeight}
      bg={
        isOver && !isBlocked
          ? "var(--mantine-color-brand-light)"
          : "var(--mantine-color-gray-light)"
      }
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        // Columns the dragged card can't reach under the workflow are dimmed
        opacity: isBlocked ? 0.5 : 1,
        transition: "opacity 150ms ease",
      }}
    >
      <Group justify="space-between" mb="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <Text fw={600} truncate>
            {column.name}
          </Text>
          <Badge variant="light" color="gray" size="sm">
            {cards.length}
          </Badge>
        </Group>

        <Group gap={4} wrap="nowrap">
          {canCreateCard ? (
            <Tooltip label="Vazifa qo'shish">
              <ActionIcon variant="subtle" color="gray" onClick={onAddCard}>
                <Plus size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}

          {canEditColumn || canDeleteColumn ? (
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <MoreHorizontal size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {canEditColumn ? (
                  <Menu.Item leftSection={<Edit size={14} />} onClick={onEdit}>
                    Tahrirlash
                  </Menu.Item>
                ) : null}
                {canDeleteColumn ? (
                  <Menu.Item
                    color="red"
                    leftSection={<Trash2 size={14} />}
                    onClick={onDelete}
                  >
                    O'chirish
                  </Menu.Item>
                ) : null}
              </Menu.Dropdown>
            </Menu>
          ) : null}
        </Group>
      </Group>

      {/* Statuses mapped to this column, shown separately from its name */}
      <Group gap={4} mt={-6} mb="sm" style={{ flexShrink: 0 }}>
        {!columnStatuses ? null : columnStatuses.length > 0 ? (
          columnStatuses.map(({ status }) => (
            <Badge
              key={status.id}
              size="xs"
              variant="dot"
              color={status.color || "gray"}
            >
              {status.name}
            </Badge>
          ))
        ) : (
          <Text size="xs" c="orange">
            Status biriktirilmagan
          </Text>
        )}
      </Group>

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        {/* Only the card list scrolls; header and add button stay pinned */}
        <Stack
          ref={setListRef}
          gap="xs"
          style={{
            flex: 1,
            minHeight: 80,
            overflowY: "auto",
            // Gap between cards and the scrollbar, only while it's visible
            paddingRight: hasScroll ? 6 : 0,
          }}
        >
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              assignee={
                card.assigneeId ? usersById.get(card.assigneeId) : undefined
              }
              status={statusesById.get(card.statusId)}
              draggable={canMoveCard}
              onOpen={() => onOpenCard(card)}
            />
          ))}

          {cards.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="md">
              Vazifalar yo'q
            </Text>
          ) : null}
        </Stack>
      </SortableContext>

      {canCreateCard ? (
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          fullWidth
          mt="xs"
          bd="1px gray dashed" bdrs="md"
          style={{ flexShrink: 0 }}
          leftSection={<Plus size={14} />}
          onClick={onAddCard}
        >
          Vazifa qo'shish
        </Button>
      ) : null}
    </Card>
  );
}

interface SortableCardProps {
  card: BoardCard;
  assignee?: User;
  status?: Status;
  draggable: boolean;
  onOpen: () => void;
}

function SortableCard({
  card,
  assignee,
  status,
  draggable,
  onOpen,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !draggable });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        flexShrink: 0,
      }}
      {...attributes}
      {...listeners}
      onClick={onOpen}
    >
      <KanbanCardContent card={card} assignee={assignee} status={status} />
    </Box>
  );
}

interface KanbanCardContentProps {
  card: BoardCard;
  assignee?: User;
  status?: Status;
  dragging?: boolean;
}

function KanbanCardContent({
  card,
  assignee,
  status,
  dragging,
}: KanbanCardContentProps) {
  const points = card.points ?? 0;

  return (
    <Card
      withBorder
      radius="md"
      p="sm"
      shadow={dragging ? "md" : undefined}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <Stack gap={6}>
        <Text size="sm" fw={500} lineClamp={2}>
          {card.title}
        </Text>

        {card.description ? (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {card.description}
          </Text>
        ) : null}

        <Group justify="space-between" wrap="nowrap">
          <Group gap={6} wrap="nowrap">
            {status ? (
              <Badge size="xs" variant="light" color={status.color || "gray"}>
                {status.name}
              </Badge>
            ) : null}

            {points > 0 ? (
              <Badge
                size="xs"
                variant="outline"
                color="gray"
                leftSection={<Star size={10} />}
              >
                {points}
              </Badge>
            ) : null}
          </Group>

          {assignee ? (
            <Tooltip label={assignee.name || assignee.email}>
              <Avatar size="sm" radius="xl" color="initials" name={assignee.name || assignee.email} />
            </Tooltip>
          ) : null}
        </Group>
      </Stack>
    </Card>
  );
}
