import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Card,
    Group,
    Menu,
    Stack,
    Table,
    Text,
} from "@mantine/core";

import {
    MoreVertical,
    Plus,
    Shield,
    UserMinus,
} from "lucide-react";

interface ProjectMembersProps {
    projectId: string;
}

const members = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "Manager",
        status: "Active",
        image: "https://i.pravatar.cc/150?img=1",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Developer",
        status: "Active",
        image: "https://i.pravatar.cc/150?img=2",
    },
    {
        id: "3",
        name: "Alex Brown",
        email: "alex@example.com",
        role: "Viewer",
        status: "Active",
        image: "https://i.pravatar.cc/150?img=3",
    },
];

export function ProjectMembers({
    projectId,
}: ProjectMembersProps) {
    const handleAddMember = () => {
        // open add member modal
    };

    const handleChangeRole = (memberId: string) => {
        // change project membership role
    };

    const handleRemoveMember = (memberId: string) => {
        // remove project membership
    };

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Stack gap={2}>
                    <Text fw={600} size="lg">
                        Project a'zolari
                    </Text>

                    <Text size="sm" c="dimmed">
                        Ushbu projectga kirish huquqiga ega foydalanuvchilar
                    </Text>
                </Stack>

                <Button
                    leftSection={<Plus size={16} />}
                    onClick={handleAddMember}
                >
                    A'zo qo'shish
                </Button>
            </Group>

            <Card withBorder radius="md" p={0}>
                <Table.ScrollContainer minWidth={700}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Foydalanuvchi</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Rol</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th />
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            {members.map((member) => (
                                <Table.Tr key={member.id}>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Avatar
                                                src={member.image}
                                                radius="xl"
                                            />

                                            <Text fw={500}>
                                                {member.name}
                                            </Text>
                                        </Group>
                                    </Table.Td>

                                    <Table.Td>
                                        <Text size="sm">
                                            {member.email}
                                        </Text>
                                    </Table.Td>

                                    <Table.Td>
                                        <Badge
                                            variant="light"
                                            leftSection={<Shield size={12} />}
                                        >
                                            {member.role}
                                        </Badge>
                                    </Table.Td>

                                    <Table.Td>
                                        <Badge
                                            color="green"
                                            variant="light"
                                        >
                                            {member.status}
                                        </Badge>
                                    </Table.Td>

                                    <Table.Td>
                                        <Menu shadow="md">
                                            <Menu.Target>
                                                <ActionIcon
                                                    variant="subtle"
                                                >
                                                    <MoreVertical size={18} />
                                                </ActionIcon>
                                            </Menu.Target>

                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    onClick={() =>
                                                        handleChangeRole(member.id)
                                                    }
                                                >
                                                    Rolni o'zgartirish
                                                </Menu.Item>

                                                <Menu.Divider />

                                                <Menu.Item
                                                    color="red"
                                                    leftSection={
                                                        <UserMinus size={16} />
                                                    }
                                                    onClick={() =>
                                                        handleRemoveMember(member.id)
                                                    }
                                                >
                                                    A'zoni chiqarish
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Card>
        </Stack>
    );
}