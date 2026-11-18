import { StrictMode } from 'react';
import { Providers } from './providers';
import { AppRouter } from './router';

export function App() {
  return (
    <StrictMode>
      <Providers>
        <AppRouter />
      </Providers>
    </StrictMode>
  );
}
