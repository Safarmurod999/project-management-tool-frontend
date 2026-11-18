import { useEffect, type ReactNode } from "react";
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
  Search,
  Sun,
  User,
} from "lucide-react";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared/config";
import styles from "./app-layout.module.scss";
import { useProfile } from "@/features/auth/model/use-profile";
import { NotificationBell } from "@/features/notification";

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
  const { toggleColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light");
  const [navOpened, { toggle: toggleNav, close: closeNav }] = useDisclosure();

  // Nested pages (e.g. /projects/view/1) keep their section highlighted
  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Close the mobile drawer after navigating
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on every route change on purpose
  useEffect(() => {
    closeNav();
  }, [location.pathname, closeNav]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useProfile();

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 264,
        breakpoint: "sm",
        collapsed: { mobile: !navOpened },
      }}
      padding="lg"
    >
      <AppShell.Header className={styles.header}>
        <Group justify="space-between" align="center" h="100%" px="md" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={navOpened}
              onClick={toggleNav}
              hiddenFrom="sm"
              size="sm"
              aria-label="Menyuni ochish"
            />
            <Link to="/" className={styles.logo}>
              <span className={styles.logoMark}>
                <Briefcase size={18} />
              </span>
              <span>ProManager</span>
            </Link>
          </Group>

          <TextInput
            placeholder="Qidirish..."
            leftSection={<Search size={16} />}
            size="sm"
            visibleFrom="md"
            style={{ flex: 1, maxWidth: 420 }}
            className={styles.searchInput}
          />

          <Group gap={6} wrap="nowrap">
            <Tooltip
              label={colorScheme === "dark" ? "Yorug' rejim" : "Qorong'i rejim"}
            >
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                radius="xl"
                onClick={() => toggleColorScheme()}
                aria-label="Rejimni almashtirish"
              >
                {colorScheme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              </ActionIcon>
            </Tooltip>

            <NotificationBell />

            <Menu width={220} position="bottom-end">
              <Menu.Target>
                <Avatar
                  size={36}
                  radius="xl"
                  color="brand"
                  variant="filled"
                  ml={4}
                  style={{ cursor: "pointer" }}
                >
                  {initial ?? <User size={18} />}
                </Avatar>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <Text size="sm" fw={600} c="var(--mantine-color-text)" lineClamp={1}>
                    {user?.name || "Foydalanuvchi"}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {user?.email}
                  </Text>
                </Menu.Label>
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
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={styles.navbar} p="sm">
        <Stack gap="lg" py="xs" style={{ flex: 1, overflow: "auto" }}>
          {menuSections.map((section) => (
            <Box key={`section-${section.id}`}>
              {section.title && (
                <Text className={styles.sectionTitle} px="sm" mb={6}>
                  {section.title}
                </Text>
              )}
              <Stack gap={2}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <UnstyledButton
                      key={item.id}
                      component={Link}
                      to={item.path}
                      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                      <Text size="sm" fw="inherit" c="inherit">
                        {item.label}
                      </Text>
                    </UnstyledButton>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>

        {user ? (
          <Box className={styles.userCard}>
            <Avatar size={34} radius="xl" color="brand" variant="light">
              {initial ?? <User size={16} />}
            </Avatar>
            <Box style={{ minWidth: 0, flex: 1 }}>
              <Text size="sm" fw={600} truncate>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user.role?.name ?? user.email}
              </Text>
            </Box>
            <Tooltip label="Chiqish">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={handleLogout}
                aria-label="Chiqish"
              >
                <LogOut size={16} />
              </ActionIcon>
            </Tooltip>
          </Box>
        ) : null}
      </AppShell.Navbar>

      <AppShell.Main className={styles.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
