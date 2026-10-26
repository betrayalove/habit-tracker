import { createGlobalStyle } from 'styled-components';
import { FONT_SIZES } from './theme';
import { TOKENS } from '@/shared/styles/tokens';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { font-size: 16px; color-scheme: ${({ theme }) => theme.colorScheme}; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: ${TOKENS.fontFamily};
    font-size: ${FONT_SIZES.body};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #root { min-height: 100vh; }
  h1 { font-size: ${FONT_SIZES.h1}; font-weight: 700; line-height: 1.2; margin: 0 0 24px; }
  h2 { font-size: ${FONT_SIZES.h2}; font-weight: 600; line-height: 1.3; margin: 0 0 16px; }
  p { margin: 0 0 16px; }
  p:last-child { margin-bottom: 0; }
  h1, h2, p, dd, span { overflow-wrap: anywhere; }
  a { color: ${({ theme }) => theme.link}; text-decoration: none; }
  a:hover { text-decoration: underline; }
  button { font: inherit; cursor: pointer; }
  input, select, textarea {
    min-width: 0;
    max-width: 100%;
    padding: 8px 16px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    font: inherit;
  }
  :focus-visible { outline: 2px solid ${({ theme }) => theme.link}; outline-offset: 3px; }
  input:focus, select:focus, textarea:focus { border-color: ${({ theme }) => theme.link}; }
  button:disabled { cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
  }
`;
