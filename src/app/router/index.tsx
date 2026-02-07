import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { ProjectsPage } from '@/pages/projects';
import { TasksPage } from '@/pages/tasks';
import { CalendarPage } from '@/pages/calendar';
import { TeamPage } from '@/pages/team';
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
  {
    path: '/login',
    element: <LoginPage />,
    layout: 'none',
    protected: false,
  },
  {
    path: '/',
    element: <HomePage />,
    layout: 'app',
    protected: true,
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
    layout: 'app',
    protected: true,
  },
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
    path: '/settings',
    element: <SettingsPage />,
    layout: 'app',
    protected: true,
  },
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
