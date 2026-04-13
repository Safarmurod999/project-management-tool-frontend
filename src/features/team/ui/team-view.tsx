import { Avatar, Group, Stack, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import styles from './team-view.module.scss';

const data = [
  {
    id: 'a1',
    name: 'asd',
    image: 'https://i.pravatar.cc/300',
    email: 'asd@gmail.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: 'a2',
    name: 'asd',
    image: 'https://i.pravatar.cc/300',
    email: 'ddasd',
    role: 'admin',
    status: 'active'
  },
  {
    id: 'a3',
    name: 'adfffffffff',
    image: 'https://i.pravatar.cc/300',
    email: 'ddasaaaaaaaad',
    role: 'admin',
    status: 'active'
  }
]

export function TeamView() {
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
        records={data}
        columns={
          [
            {
              accessor: 'name',
              title: "A'zo",
              textAlign: 'left',
              render: (r) => (
                <Group>
                  <Avatar radius='sm' src={r.image} alt={r.name}/>
                  <Stack gap='0'>
                    <Text fw='600' tt='capitalize'>{r.name}</Text>
                    <Text>{r.email}</Text>
                  </Stack>
                </Group>
              )
            },
            {
              accessor: 'role',
              title: 'Roli',
              textAlign: 'left'
            },
            {
              accessor: 'status',
              title: 'Holati'
            }
          ]
        }
        noRecordsText="Ma'lumotlar topilmadi"
      />



    </Stack>
  )
}
