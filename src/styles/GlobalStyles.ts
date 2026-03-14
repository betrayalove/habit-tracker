import { createGlobalStyle } from 'styled-components';
import { FONT_SIZES } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: ${FONT_SIZES.body};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  h1 {
    font-size: ${FONT_SIZES.h1};
    font-weight: 700;
    margin: 0 0 0.5em;
  }

  h2 {
    font-size: ${FONT_SIZES.h2};
    font-weight: 600;
    margin: 0 0 0.5em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }
`;
