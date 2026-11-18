import {
    Badge,
    Card,
    Group,
    Stack,
    Text,
    Timeline,
} from "@mantine/core";

import {
    Archive,
    KanbanSquare,
    Settings,
    UserPlus,
} from "lucide-react";

interface ProjectActivityProps {
    projectId: string;
}

const activities = [
    {
        id: "1",
        title: 'Development board yaratildi',
        description: "John Doe yangi board yaratdi",
        date: "20 daqiqa oldin",
        icon: <KanbanSquare size={16} />,
        color: "blue",
    },
    {
        id: "2",
        title: "Yangi a'zo qo'shildi",
        description: "Jane Smith projectga qo'shildi",
        date: "1 soat oldin",
        icon: <UserPlus size={16} />,
        color: "green",
    },
    {
        id: "3",
        title: "Project yangilandi",
        description: "Project description o'zgartirildi",
        date: "Kecha",
        icon: <Settings size={16} />,
        color: "orange",
    },
    {
        id: "4",
        title: "Board arxivlandi",
        description: "Old Development board arxivlandi",
        date: "2 kun oldin",
        icon: <Archive size={16} />,
        color: "gray",
    },
];

export function ProjectActivity({
    projectId,
}: ProjectActivityProps) {
    return (
        <Stack gap="md">
            <Stack gap={2}>
                <Text fw={600} size="lg">
                    Faoliyat
                </Text>

                <Text size="sm" c="dimmed">
                    Projectda amalga oshirilgan oxirgi harakatlar
                </Text>
            </Stack>

            <Card withBorder radius="md">
                <Timeline
                    active={activities.length}
                    bulletSize={30}
                    lineWidth={2}
                >
                    {activities.map((activity) => (
                        <Timeline.Item
                            key={activity.id}
                            bullet={activity.icon}
                            title={
                                <Group gap="sm">
                                    <Text fw={500}>
                                        {activity.title}
                                    </Text>

                                    <Badge
                                        size="xs"
                                        variant="light"
                                    >
                                        {activity.date}
                                    </Badge>
                                </Group>
                            }
                        >
                            <Text
                                size="sm"
                                c="dimmed"
                                mt={4}
                            >
                                {activity.description}
                            </Text>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Card>
        </Stack>
    );
}