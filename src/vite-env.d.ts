/// <reference types="vite/client" />

import type { LIGHT_THEME } from './styles/theme';

type Theme = Record<keyof typeof LIGHT_THEME, string>;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
