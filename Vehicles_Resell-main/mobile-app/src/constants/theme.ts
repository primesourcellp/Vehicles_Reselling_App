import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111111',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E8E8EC',
    backgroundCard: '#F5F5F7',
    textSecondary: '#6B6B6B',
    textMuted: '#9A9A9A',
    border: '#EBEBEF',
    success: '#22A06B',
    danger: '#E5484D',
    chartBar: '#D4D4D8',
    chartBarActive: '#111111',
    tabInactive: '#9A9A9A',
  },
  dark: {
    text: '#FFFFFF',
    background: '#111111',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    backgroundCard: '#1A1A1D',
    textSecondary: '#B0B4BA',
    textMuted: '#7A7A7A',
    border: '#2E3135',
    success: '#3DD68C',
    danger: '#F2555A',
    chartBar: '#3A3A3F',
    chartBarActive: '#FFFFFF',
    tabInactive: '#7A7A7A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
