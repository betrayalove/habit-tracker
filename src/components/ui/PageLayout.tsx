import styled from 'styled-components';
import { SPACING, BREAKPOINTS } from '@/styles/theme';

export const PageLayout = styled.main`
  max-width: ${BREAKPOINTS.lg}px;
  margin: 0 auto;
  padding: clamp(${SPACING.sm}px, 3vw, ${SPACING.md}px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
