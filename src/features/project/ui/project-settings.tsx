import {
    Button,
    Card,
    Divider,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
    Textarea,
} from "@mantine/core";

import {
    Archive,
    Save,
    Trash2,
} from "lucide-react";

import { StatusManager, WorkflowManager } from "@/features/board";

interface ProjectSettingsProps {
    projectId: string;
}

export function ProjectSettings({
    projectId,
}: ProjectSettingsProps) {
    const handleSave = () => {
        // update project
    };

    const handleArchive = () => {
        // archive project
    };

    const handleDelete = () => {
        // delete project
    };

    return (
        <Stack gap="md">
            <Card withBorder radius="md">
                <Stack gap="md">
                    <Stack gap={2}>
                        <Text fw={600} size="lg">
                            Umumiy sozlamalar
                        </Text>

                        <Text size="sm" c="dimmed">
                            Project ma'lumotlarini boshqaring
                        </Text>
                    </Stack>

                    <TextInput
                        label="Project nomi"
                        placeholder="Project nomi"
                        defaultValue="Customer Portal V2"
                    />

                    <Textarea
                        label="Description"
                        placeholder="Project haqida"
                        minRows={4}
                        defaultValue="Redesign of customer portal"
                    />

                    <Select
                        label="Status"
                        data={[
                            {
                                value: "active",
                                label: "Active",
                            },
                            {
                                value: "archived",
                                label: "Archived",
                            },
                        ]}
                        defaultValue="active"
                    />

                    <Group justify="flex-end">
                        <Button
                            leftSection={<Save size={16} />}
                            onClick={handleSave}
                        >
                            Saqlash
                        </Button>
                    </Group>
                </Stack>
            </Card>

            <StatusManager projectId={projectId} />

            <WorkflowManager projectId={projectId} />

            <Card withBorder radius="md">
                <Stack gap="md">
                    <Stack gap={2}>
                        <Text fw={600}>
                            Access & Permissions
                        </Text>

                        <Text size="sm" c="dimmed">
                            Project a'zolari va ularning rollarini boshqarish
                        </Text>
                    </Stack>

                    <Button
                        variant="light"
                        onClick={() => {
                            // navigate to permissions
                        }}
                    >
                        Ruxsatlarni boshqarish
                    </Button>
                </Stack>
            </Card>

            <Card
                withBorder
                radius="md"
                style={{
                    borderColor: "var(--mantine-color-red-3)",
                }}
            >
                <Stack gap="md">
                    <Stack gap={2}>
                        <Text fw={600} c="red">
                            Danger Zone
                        </Text>

                        <Text size="sm" c="dimmed">
                            Project uchun qaytarib bo'lmaydigan operatsiyalar
                        </Text>
                    </Stack>

                    <Divider />

                    <Group justify="space-between">
                        <Stack gap={2}>
                            <Text fw={500}>
                                Projectni arxivlash
                            </Text>

                            <Text size="sm" c="dimmed">
                                Projectni vaqtincha yopish
                            </Text>
                        </Stack>

                        <Button
                            variant="light"
                            color="orange"
                            leftSection={<Archive size={16} />}
                            onClick={handleArchive}
                        >
                            Arxivlash
                        </Button>
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                        <Stack gap={2}>
                            <Text fw={500}>
                                Projectni o'chirish
                            </Text>

                            <Text size="sm" c="dimmed">
                                Bu amalni qaytarib bo'lmaydi
                            </Text>
                        </Stack>

                        <Button
                            color="red"
                            variant="light"
                            leftSection={<Trash2 size={16} />}
                            onClick={handleDelete}
                        >
                            O'chirish
                        </Button>
                    </Group>
                </Stack>
            </Card>
        </Stack>
    );
}