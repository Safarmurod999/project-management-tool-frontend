import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { OTPPage } from '@/pages/otp';
import { UserVerificationPage } from '@/pages/user-verification';
import { ProjectPage, ProjectViewPage } from '@/pages/projects';
import { BoardViewPage } from '@/pages/board';
import { TasksPage } from '@/pages/tasks';
import { CalendarPage } from '@/pages/calendar';
import { TeamPage } from '@/pages/team';
import { TeamViewPage } from "@/pages/team";
import { SettingsPage } from '@/pages/settings';
import { AppLayout } from '@/app/layouts';
import { ProtectedRoute } from './protected-route';

type AppRoute = RouteObject & {
  path: string;
  element: React.ReactNode;
  layout?: 'app' | 'none';
  protected?: boolean;
};

const routes: AppRoute[] = [
  // Auth
  {
    path: '/login',
    element: <LoginPage />,
    layout: 'none',
    protected: false,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    layout: 'none',
    protected: false,
  },
  {
    path: '/verify-otp',
    element: <OTPPage />,
    layout: 'none',
    protected: false,
  },
  {
    path: '/verify-user',
    element: <UserVerificationPage />,
    layout: 'none',
    protected: false,
  },

  // Home
  {
    path: '/',
    element: <HomePage />,
    layout: 'app',
    protected: true,
  },

  // Projects
  {
    path: '/projects',
    element: <ProjectPage />,
    layout: 'app',
    protected: true,
  },

  // Project overview
  {
    path: '/projects/view/:id',
    element: <ProjectViewPage />,
    layout: 'app',
    protected: true,
  },

  // Project tabs
  {
    path: '/projects/view/:id/:tab',
    element: <ProjectViewPage />,
    layout: 'app',
    protected: true,
  },

  // Boards
  {
    path: '/boards/:id',
    element: <BoardViewPage />,
    layout: 'app',
    protected: true,
  },

  // Other
  {
    path: '/tasks',
    element: <TasksPage />,
    layout: 'app',
    protected: true,
  },
  {
    path: '/calendar',
    element: <CalendarPage />,
    layout: 'app',
    protected: true,
  },
  {
    path: '/team',
    element: <TeamPage />,
    layout: 'app',
    protected: true,
  },
  {
    path: '/team/view/:id',
    element: <TeamViewPage />,
    layout: 'app',
    protected: true,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    layout: 'app',
    protected: true,
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          let element = route.element;

          // Wrap with ProtectedRoute if protected
          if (route.protected) {
            element = <ProtectedRoute>{element}</ProtectedRoute>;
          }

          // Wrap with AppLayout if needed
          if (route.layout === 'app') {
            element = <AppLayout>{element}</AppLayout>;
          }

          return (
            <Route key={route.path} path={route.path} element={element} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}
