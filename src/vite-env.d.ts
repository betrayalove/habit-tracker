/// <reference types="vite/client" />

import type { LIGHT_THEME } from './styles/theme';

type Theme = typeof LIGHT_THEME;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
