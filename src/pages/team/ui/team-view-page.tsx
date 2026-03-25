import { PageHeader } from "@/shared/ui";
import { Button, Container } from "@mantine/core";
import { SettingsIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useTeam, TeamView } from "@/features/team";

export function TeamViewPage() {
  const {id} = useParams();
  const navigate = useNavigate();

  const {data, isFetched} = useTeam(id!);

  return (
    <Container size="xl" py="md">
      {
        (isFetched && data) && (
          <PageHeader
            breadcrumbs={[
              {label: 'Asosiy', href: '/'},
              {label: 'Jamoa'},
              {label: data.name}
            ]}
            title={data.name}
            description={data.description}
            icon={<Users size={32} color="var(--mantine-color-blue-6)"/>}
            rightSection={
              <Button
                leftSection={<SettingsIcon size={16}/>}
                onClick={() => navigate(`/team/view/${id}/permissions`)}
              >
                Ruxsatlarni boshqarish
              </Button>
            }
          />

        )
      }
      <TeamView/>
    </Container>
  )
}
