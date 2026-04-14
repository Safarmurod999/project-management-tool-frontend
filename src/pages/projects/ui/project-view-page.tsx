import { PageHeader } from "@/shared/ui";
import { Container } from "@mantine/core";
import { Users } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useProject, ProjectView } from "@/features/project";

export function ProjectViewPage() {
  const { id } = useParams();
  // const navigate = useNavigate();

  const { data, isFetched } = useProject(id!);

  return (
    <Container size="xl" py="md">
      {
        (isFetched && data) && (
          <PageHeader
            breadcrumbs={[
              { label: 'Asosiy', href: '/' },
              { label: 'Loyiha' },
              { label: data.name }
            ]}
            title={data.name}
            description={data.description}
            icon={<Users size={32} color="var(--mantine-color-blue-6)" />}
          // rightSection={
          //   <Button
          //     leftSection={<SettingsIcon size={16}/>}
          //     onClick={() => navigate(`/project/view/${id}/permissions`)}
          //   >
          //     Ruxsatlarni boshqarish
          //   </Button>
          // }
          />

        )
      }
      <ProjectView />
    </Container>
  )
}
