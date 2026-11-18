import { useMemo } from "react";

import { Container, Tabs } from "@mantine/core";

import {
  Activity,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { useNavigate, useParams } from "react-router";

import { PageHeader } from "@/shared/ui";

import { useProjectRealtime } from "@/features/board";

import {
  ProjectActivity,
  ProjectBoards,
  ProjectMembers,
  ProjectSettings,
  ProjectView,
  useProject,
} from "@/features/project";

const TAB_VALUES = [
  "overview",
  "boards",
  "members",
  "activity",
  "settings",
] as const;

type ProjectTab = (typeof TAB_VALUES)[number];

export function ProjectViewPage() {
  const { id, tab } = useParams<{
    id: string;
    tab?: ProjectTab;
  }>();

  console.log(tab);
  

  const navigate = useNavigate();

  const { data, isFetched } = useProject(id!);

  useProjectRealtime(id ?? "");

  const activeTab = useMemo<ProjectTab>(() => {
    if (tab && TAB_VALUES.includes(tab)) {
      return tab;
    }

    return "overview";
  }, [tab]);

  const handleTabChange = (value: string | null) => {
    if (!value || !id) {
      return;
    }

    if (value === "overview") {
      navigate(`/projects/view/${id}`);
      return;
    }

    navigate(`/projects/view/${id}/${value}`);
  };

  return (
    <Container size="xl" py="md">
      {isFetched && data && (
        <PageHeader
          breadcrumbs={[
            {
              label: "Asosiy",
              href: "/",
            },
            {
              label: "Loyiha",
            },
            {
              label: data.name,
            },
          ]}
          title={data.name}
          description={data.description}
          icon={
            <KanbanSquare
              size={22}
            />
          }
        />
      )}

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        mt="md"
      >
        <Tabs.List>
          <Tabs.Tab
            value="overview"
            leftSection={<LayoutDashboard size={16} />}
          >
            Umumiy
          </Tabs.Tab>

          <Tabs.Tab
            value="boards"
            leftSection={<KanbanSquare size={16} />}
          >
            Boardlar
          </Tabs.Tab>

          <Tabs.Tab
            value="members"
            leftSection={<Users size={16} />}
          >
            A'zolar
          </Tabs.Tab>

          <Tabs.Tab
            value="activity"
            leftSection={<Activity size={16} />}
          >
            Faoliyat
          </Tabs.Tab>

          <Tabs.Tab
            value="settings"
            leftSection={<Settings size={16} />}
          >
            Sozlamalar
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <ProjectView />
        </Tabs.Panel>

        <Tabs.Panel value="boards" pt="md">
          <ProjectBoards projectId={id!} />
        </Tabs.Panel>

        <Tabs.Panel value="members" pt="md">
          <ProjectMembers projectId={id!} />
        </Tabs.Panel>

        <Tabs.Panel value="activity" pt="md">
          <ProjectActivity projectId={id!} />
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="md">
          <ProjectSettings projectId={id!} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}