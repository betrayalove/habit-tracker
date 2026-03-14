import { TOKENS } from '@/shared/styles/tokens';

export const LIGHT_THEME = {
  primary: TOKENS.colors.primary,
  secondary: TOKENS.colors.secondary,
  background: TOKENS.colors.backgroundLight,
  surface: TOKENS.colors.backgroundLight,
  success: TOKENS.colors.success,
  error: TOKENS.colors.danger,
  text: TOKENS.colors.textLight,
  textSecondary: TOKENS.colors.secondary,
  shadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
};

export const DARK_THEME = {
  primary: TOKENS.colors.primary,
  secondary: TOKENS.colors.secondary,
  background: TOKENS.colors.backgroundDark,
  surface: TOKENS.colors.backgroundDark,
  success: TOKENS.colors.success,
  error: TOKENS.colors.danger,
  text: TOKENS.colors.textDark,
  textSecondary: TOKENS.colors.secondary,
  shadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
};

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export const BORDER_RADIUS = {
  card: 8,
  button: 6,
} as const;

export const BREAKPOINTS = {
  xs: 360,
  sm: 768,
  md: 1024,
  lg: 1280,
} as const;

export const FONT_SIZES = {
  h1: 'clamp(1.5rem, 2vw + 1rem, 1.75rem)',
  h2: 'clamp(1.15rem, 1.5vw + 0.9rem, 1.35rem)',
  body: 'clamp(0.9rem, 0.5vw + 0.85rem, 1rem)',
};
