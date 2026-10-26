import { TOKENS } from '@/shared/styles/tokens';

const common = {
  primary: TOKENS.colors.primary,
  dangerBackground: '#dc2626',
  success: '#16a34a',
};

export const LIGHT_THEME = {
  ...common,
  ...TOKENS.colors.light,
  colorScheme: 'light',
  shadow: '0 1px 3px rgb(15 23 42 / 0.06)',
};

export const DARK_THEME = {
  ...common,
  ...TOKENS.colors.dark,
  colorScheme: 'dark',
  shadow: '0 1px 3px rgb(0 0 0 / 0.2)',
};

export const SPACING = { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 } as const;
export const BORDER_RADIUS = { card: 12, button: 8 } as const;
export const BREAKPOINTS = { xs: 360, sm: 768, md: 1024, lg: 1280 } as const;
export const FONT_SIZES = {
  h1: 'clamp(1.75rem, 2vw + 1rem, 2rem)',
  h2: 'clamp(1.25rem, 1.5vw + 0.9rem, 1.5rem)',
  body: '1rem',
};
