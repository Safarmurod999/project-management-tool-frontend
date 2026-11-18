import {
  ActionIcon,
  Badge,
  Button,
  Card,
  type CSSVariablesResolver,
  createTheme,
  type MantineColorsTuple,
  Menu,
  Modal,
  Paper,
  Popover,
  SegmentedControl,
  Select,
  Tabs,
  TextInput,
  Tooltip,
} from '@mantine/core';

// Indigo-violet brand; shade 6 is the primary in light mode, 5 in dark
const brand: MantineColorsTuple = [
  '#eef0ff',
  '#dfe2ff',
  '#bcc2ff',
  '#979fff',
  '#7781fb',
  '#636ef8',
  '#4f5bf0',
  '#3f4ad6',
  '#353fb0',
  '#2b338a',
];

// Neutral, slightly cool dark surfaces (0 = text, 7 = surface, 8 = app background)
const dark: MantineColorsTuple = [
  '#c9cbd3',
  '#a6a9b5',
  '#7e8293',
  '#5c6070',
  '#3f4250',
  '#2e303b',
  '#23252f',
  '#191a22',
  '#121319',
  '#0b0c10',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 5 },
  colors: { brand, dark },
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  // One step smaller than Mantine's defaults (12/14/16/18/20)
  fontSizes: {
    xs: '11px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
  },
  headings: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '26px', lineHeight: '1.25' },
      h2: { fontSize: '22px', lineHeight: '1.3' },
      h3: { fontSize: '18px', lineHeight: '1.35' },
      h4: { fontSize: '16px', lineHeight: '1.4' },
      h5: { fontSize: '14px', lineHeight: '1.45' },
      h6: { fontSize: '13px', lineHeight: '1.5' },
    },
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  focusRing: 'auto',
  shadows: {
    xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
    sm: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
    md: '0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
    lg: '0 12px 24px -4px rgba(16, 24, 40, 0.10), 0 4px 8px -4px rgba(16, 24, 40, 0.05)',
    xl: '0 24px 48px -12px rgba(16, 24, 40, 0.18)',
  },
  components: {
    Button: Button.extend({
      defaultProps: { radius: 'md' },
      styles: { root: { fontWeight: 600 } },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: { radius: 'md' },
    }),
    Card: Card.extend({
      defaultProps: { radius: 'lg', withBorder: true },
      classNames: { root: 'app-card' },
    }),
    Paper: Paper.extend({
      defaultProps: { radius: 'lg' },
    }),
    Badge: Badge.extend({
      defaultProps: { radius: 'sm', variant: 'light' },
      styles: { root: { textTransform: 'none', fontWeight: 600 } },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: 'lg',
        centered: true,
        overlayProps: { backgroundOpacity: 0.4, blur: 4 },
      },
      styles: { title: { fontWeight: 700, fontSize: 'var(--mantine-font-size-lg)' } },
    }),
    Menu: Menu.extend({
      defaultProps: { radius: 'md', shadow: 'lg' },
    }),
    Popover: Popover.extend({
      defaultProps: { radius: 'lg', shadow: 'lg' },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: { radius: 'sm', withArrow: true },
    }),
    TextInput: TextInput.extend({
      defaultProps: { radius: 'md' },
    }),
    Select: Select.extend({
      defaultProps: { radius: 'md' },
    }),
    SegmentedControl: SegmentedControl.extend({
      defaultProps: { radius: 'md' },
    }),
    Tabs: Tabs.extend({
      styles: { tab: { fontWeight: 600 } },
    }),
  },
});

/** App-level surface tokens, used by layouts and global CSS */
export const cssVariablesResolver: CSSVariablesResolver = (t) => ({
  variables: {},
  light: {
    '--app-bg': '#f6f7f9',
    '--app-surface': '#ffffff',
    '--app-border': '#e6e8ee',
    '--app-muted-bg': '#f1f2f6',
    '--app-nav-active-bg': t.colors.brand[0],
    '--app-nav-active-color': t.colors.brand[7],
    '--mantine-color-default-border': '#e6e8ee',
  },
  dark: {
    '--app-bg': t.colors.dark[8],
    '--app-surface': t.colors.dark[7],
    '--app-border': t.colors.dark[5],
    '--app-muted-bg': t.colors.dark[6],
    '--app-nav-active-bg': 'rgba(99, 110, 248, 0.16)',
    '--app-nav-active-color': t.colors.brand[3],
    '--mantine-color-default-border': t.colors.dark[5],
  },
});
