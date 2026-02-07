import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  ListChecks,
  FolderOpen,
  Calendar,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/config';
import styles from './app-layout.module.scss';

interface SidebarMenuItemType {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  onClick?: () => void;
}

interface SidebarSection {
  title?: string;
  items: SidebarMenuItemType[];
}

interface AppLayoutProps {
  children: ReactNode;
}

const menuSections: SidebarSection[] = [
  {
    title: 'Bosh Menyu',
    items: [
      {
        id: 'home',
        label: 'Asosiy',
        icon: Home,
        path: ROUTES.HOME,
      },
      {
        id: 'projects',
        label: 'Loyihalar',
        icon: FolderOpen,
        path: '/projects',
      },
      {
        id: 'tasks',
        label: 'Vazifalar',
        icon: ListChecks,
        path: '/tasks',
      },
      {
        id: 'calendar',
        label: 'Taqvim',
        icon: Calendar,
        path: '/calendar',
      },
    ],
  },
  {
    title: 'Boshqarish',
    items: [
      {
        id: 'team',
        label: 'Jamoa',
        icon: Users,
        path: '/team',
      },
      {
        id: 'settings',
        label: 'Sozlamalar',
        icon: Settings,
        path: '/settings',
      },
    ],
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <div>📋</div>
            <span>ProManager</span>
          </Link>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Lotin, loyiha, foydalanuvchini qidirish..."
              aria-label="Qidirish"
            />
          </div>

          <div className={styles.headerActions} />
        </div>
      </header>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          {menuSections.map((section, idx) => (
            <div key={`section-${idx}`} className={styles.sidebarSection}>
              {section.title && (
                <div className={styles.sidebarSectionTitle}>{section.title}</div>
              )}
              <ul className={styles.sidebarList}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        className={`${styles.sidebarItem} ${active ? styles.active : ''}`}
                        title={item.label}
                      >
                        <Icon size={18} className={styles.itemIcon} />
                        <span className={styles.itemLabel}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Logout Section */}
          <div className={`${styles.sidebarSection} ${styles.logoutSection}`}>
            <ul className={styles.sidebarList}>
              <li>
                <button
                  className={styles.sidebarItem}
                  onClick={handleLogout}
                  title="Hisapdan chiqish"
                  type="button"
                >
                  <LogOut size={18} className={styles.itemIcon} />
                  <span className={styles.itemLabel}>Chiqish</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
