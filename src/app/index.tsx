import { StrictMode } from 'react';
import { Providers } from './providers';
import { AppRouter } from './router';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export function App() {
  return (
    <StrictMode>
      <Providers>
        <AppRouter />
      </Providers>
    </StrictMode>
  );
}
