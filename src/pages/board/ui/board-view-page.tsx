import { useState } from "react";

import { Button, Center, Container, Loader, Modal, Text } from "@mantine/core";

import { Edit, KanbanSquare } from "lucide-react";

import { useParams } from "react-router-dom";

import { PageHeader } from "@/shared/ui";

import {
  BoardKanban,
  EditBoardForm,
  useBoardDetails,
  useProjectRealtime,
} from "@/features/board";
import { Access, useAccess } from "@/entities/user";

export function BoardViewPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useBoardDetails(id ?? "");
  const canEditBoard = useAccess(Access.BOARD_EDIT);

  // Hooks must run before the early returns below
  useProjectRealtime(data?.project.id ?? "");

  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Container size="xl" py="md">
        <Text ta="center" c="red">
          Boardni yuklashda xatolik yuz berdi
        </Text>
      </Container>
    );
  }

  const { board, project } = data;

  return (
    <Container fluid py="sm">
      <PageHeader
        breadcrumbs={[
          {
            label: "Asosiy",
            href: "/",
          },
          {
            label: project.name,
            href: `/projects/view/${project.id}/boards`,
          },
          {
            label: board.name,
          },
        ]}
        title={board.name}
        description={board.description ?? undefined}
        icon={
          <KanbanSquare
            size={32}
            color="var(--mantine-color-blue-6)"
          />
        }
        rightSection={
          canEditBoard ? (
            <Button
              variant="light"
              radius="md"
              leftSection={<Edit size={16} />}
              onClick={() => setIsEditOpen(true)}
            >
              Tahrirlash
            </Button>
          ) : undefined
        }
      />

      <BoardKanban boardId={board.id} projectId={project.id} />

      <Modal
        opened={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Boardni tahrirlash"
      >
        <EditBoardForm
          board={board}
          onSuccess={() => setIsEditOpen(false)}
        />
      </Modal>
    </Container>
  );
}
