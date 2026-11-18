import { Avatar, Group, Stack, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import styles from './team-view.module.scss';
import { useTeamMembers } from "../model/use-user";
import { useParams } from "react-router";

export function TeamView() {
  const { id } = useParams();

  const { data, isFetched } = useTeamMembers(id!);

  return (
    <Stack p={20} className={styles.teamView} bdrs={10}>
      <Group justify='space-between'>
        <Text size='xl' fw={600}>Jamoa a'zolari</Text>
      </Group>

      <DataTable
        withRowBorders
        striped={true}
        highlightOnHover={true}
        loaderType="dots"
        records={data && data.length && isFetched ? data : []}
        columns={
          [
            {
              accessor: 'name',
              title: "A'zo",
              textAlign: 'left',
              render: (r) => (
                <Group>
                  <Avatar radius='sm' src={''} alt={r.user.name} />
                  <Stack gap='0'>
                    <Text fw='600' tt='capitalize'>{r.user.name}</Text>
                    <Text>{r.user.email}</Text>
                  </Stack>
                </Group>
              )
            },
            {
              accessor: 'role.name',
              title: 'Roli',
              textAlign: 'left'
            },
            {
              accessor: 'role.description',
              title: 'Rol tavsifi'
            }
          ]
        }
        noRecordsText="Ma'lumotlar topilmadi"
      />

    </Stack>
  )
}
