import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  ListChecks,
  FolderOpen,
  Calendar,
  Users,
  Settings,
  LogOut,
  Briefcase,
  Moon,
  Sun,
  User,
} from "lucide-react";
import {
  AppShell,
  Box,
  Group,
  TextInput,
  UnstyledButton,
  Stack,
  Divider,
  Text,
  Avatar,
  Menu,
  useMantineColorScheme,
} from "@mantine/core";
import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared/config";
import styles from "./app-layout.module.scss";

interface SidebarMenuItemType {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarSection {
  id: number;
  title?: string;
  items: SidebarMenuItemType[];
}

interface AppLayoutProps {
  children: ReactNode;
}

const menuSections: SidebarSection[] = [
  {
    id: 0,
    title: "Bosh Menyu",
    items: [
      {
        id: "home",
        label: "Asosiy",
        icon: Home,
        path: ROUTES.HOME,
      },
      {
        id: "projects",
        label: "Loyihalar",
        icon: FolderOpen,
        path: "/projects",
      },
      {
        id: "tasks",
        label: "Vazifalar",
        icon: ListChecks,
        path: "/tasks",
      },
      {
        id: "calendar",
        label: "Taqvim",
        icon: Calendar,
        path: "/calendar",
      },
    ],
  },
  {
    id: 1,
    title: "Boshqarish",
    items: [
      {
        id: "team",
        label: "Jamoa",
        icon: Users,
        path: "/team",
      },
      {
        id: "settings",
        label: "Sozlamalar",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: "sm" }}
      padding="md">
      <AppShell.Header className={styles.header}>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Group gap={10} flex={0}>
            <Link to="/" className={styles.logo}>
              <Briefcase size={22} color="var(--mantine-color-blue-6)" />
              <span>ProManager</span>
            </Link>
          </Group>

          <TextInput
            placeholder="Qidirish..."
            size="sm"
            radius="md"
            style={{ flex: 1, maxWidth: 340 }}
            className={styles.searchInput}
          />

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                size="md"
                radius="xl"
                color="blue"
                variant="filled"
                style={{ cursor: 'pointer' }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </Avatar>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <div>
                  <Text size="sm" fw={600} lineClamp={1}>
                    {user?.name || 'Foydalanuvchi'}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {user?.email || 'user@example.com'}
                  </Text>
                </div>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                leftSection={colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === 'dark' ? 'Yorug\'lik rejim' : 'Qorong\'i rejim'}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<Settings size={16} />}
                component={Link}
                to="/settings"
              >
                Sozlamalar
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<LogOut size={16} />}
                onClick={handleLogout}
              >
                Chiqish
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        className={styles.navbar}
        style={{ display: "flex", flexDirection: "column" }}>
        <Stack gap={0} py="sm" style={{ flex: 1, overflow: "auto" }}>
          {menuSections.map((section, idx) => (
            <Box key={`section-${section.id}`}>
              {section.title && (
                <Text
                  size="xs"
                  fw={700}
                  c="dimmed"
                  tt="uppercase"
                  px="md"
                  py="xs"
                  style={{ letterSpacing: "0.8px" }}>
                  {section.title}
                </Text>
              )}
              <Stack gap={4} px="xs">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <UnstyledButton
                      key={item.id}
                      component={Link}
                      to={item.path}
                      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                      title={item.label}
                      bd="1px solid transparent"
                      p="xs"
                      >
                      <Group gap="sm" wrap="nowrap">
                        <Icon size={18} />
                        <Text size="sm" fw={500}>
                          {item.label}
                        </Text>
                      </Group>
                    </UnstyledButton>
                  );
                })}
              </Stack>
              {idx < menuSections.length - 1 && <Divider my="md" />}
            </Box>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className={styles.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
