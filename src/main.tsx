// Library styles first, so app styles (CSS modules, index.css) override them
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import { App } from './app';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
