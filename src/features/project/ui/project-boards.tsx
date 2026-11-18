import { useState } from "react";

import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Center,
    Group,
    Loader,
    Menu,
    Modal,
    SimpleGrid,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import {
    ArrowRight,
    Edit,
    KanbanSquare,
    MoreHorizontal,
    Plus,
    Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { type Board, BoardStatus } from "@/entities/board";
import { Access, useAccess } from "@/entities/user";
import {
    CreateBoardForm,
    EditBoardForm,
    useBoardDelete,
    useBoards,
} from "@/features/board";

interface ProjectBoardsProps {
    projectId: string;
}

export function ProjectBoards({
    projectId,
}: ProjectBoardsProps) {
    const navigate = useNavigate();

    const { data: boards, isLoading, isError } = useBoards(projectId);
    const { mutate: deleteBoard, isPending: isDeleting } = useBoardDelete(projectId);

    const canCreateBoard = useAccess(Access.BOARD_CREATE);
    const canEditBoard = useAccess(Access.BOARD_EDIT);
    const canDeleteBoard = useAccess(Access.BOARD_DELETE);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);

    const handleOpenBoard = (boardId: string) => {
        navigate(`/boards/${boardId}`);
    };

    const handleDeleteBoard = (board: Board) => {
        if (!window.confirm(`"${board.name}" boardini o'chirishni xohlaysizmi?`)) {
            return;
        }

        deleteBoard(board.id, {
            onSuccess: () => {
                notifications.show({
                    title: "Muvaffaqiyatli",
                    message: "Board o'chirildi",
                    color: "green",
                });
            },
            onError: () => {
                notifications.show({
                    title: "Xatolik",
                    message: "Boardni o'chirishda xatolik yuz berdi",
                    color: "red",
                });
            },
        });
    };

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Stack gap={2}>
                    <Text fw={600} size="lg">
                        Boardlar
                    </Text>

                    <Text size="sm" c="dimmed">
                        Projectdagi barcha boardlar
                    </Text>
                </Stack>

                {canCreateBoard ? (
                    <Button
                        leftSection={<Plus size={16} />}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Board yaratish
                    </Button>
                ) : null}
            </Group>

            {isLoading ? (
                <Center py="xl">
                    <Loader />
                </Center>
            ) : isError ? (
                <Card withBorder radius="md" p="xl">
                    <Text ta="center" c="red">
                        Boardlarni yuklashda xatolik yuz berdi
                    </Text>
                </Card>
            ) : boards && boards.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {boards.map((board) => (
                        <Card
                            key={board.id}
                            withBorder
                            radius="md"
                            p="md"
                        >
                            <Stack gap="md" h="100%" justify="space-between">
                                <Stack gap="sm">
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                                            <KanbanSquare size={20} />

                                            <Text fw={600} truncate>
                                                {board.name}
                                            </Text>
                                        </Group>

                                        <Group gap={4} wrap="nowrap">
                                            <Badge
                                                size="sm"
                                                variant="light"
                                                color={board.status === BoardStatus.ACTIVE ? "green" : "gray"}
                                            >
                                                {board.status === BoardStatus.ACTIVE ? "Faol" : "Arxivlangan"}
                                            </Badge>

                                            {canEditBoard || canDeleteBoard ? (
                                                <Menu shadow="md" width={180} position="bottom-end">
                                                    <Menu.Target>
                                                        <ActionIcon variant="subtle" color="gray">
                                                            <MoreHorizontal size={16} />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        {canEditBoard ? (
                                                            <Menu.Item
                                                                leftSection={<Edit size={14} />}
                                                                onClick={() => setEditingBoard(board)}
                                                            >
                                                                Tahrirlash
                                                            </Menu.Item>
                                                        ) : null}

                                                        {canDeleteBoard ? (
                                                            <Menu.Item
                                                                color="red"
                                                                leftSection={<Trash2 size={14} />}
                                                                disabled={isDeleting}
                                                                onClick={() => handleDeleteBoard(board)}
                                                            >
                                                                O'chirish
                                                            </Menu.Item>
                                                        ) : null}
                                                    </Menu.Dropdown>
                                                </Menu>
                                            ) : null}
                                        </Group>
                                    </Group>

                                    <Text size="sm" c="dimmed" lineClamp={3}>
                                        {board.description || "Tavsif yo'q"}
                                    </Text>

                                    <Text size="xs" c="dimmed">
                                        {new Date(board.createdAt).toLocaleDateString("uz-UZ")}
                                    </Text>
                                </Stack>

                                <Button
                                    variant="light"
                                    rightSection={<ArrowRight size={16} />}
                                    onClick={() => handleOpenBoard(board.id)}
                                >
                                    Ochish
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Card withBorder radius="md" p="xl">
                    <Text ta="center" c="dimmed">
                        Hozircha hech qanday board yo'q
                    </Text>
                </Card>
            )}

            <Modal
                opened={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Yangi board"
            >
                <CreateBoardForm
                    projectId={projectId}
                    onSuccess={(board) => {
                        setIsCreateOpen(false);
                        handleOpenBoard(board.id);
                    }}
                />
            </Modal>

            <Modal
                opened={Boolean(editingBoard)}
                onClose={() => setEditingBoard(null)}
                title="Boardni tahrirlash"
            >
                {editingBoard ? (
                    <EditBoardForm
                        board={editingBoard}
                        onSuccess={() => setEditingBoard(null)}
                    />
                ) : null}
            </Modal>
        </Stack>
    );
}
