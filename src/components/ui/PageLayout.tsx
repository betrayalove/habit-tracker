import styled from 'styled-components';
import { SPACING, BREAKPOINTS } from '@/styles/theme';

export const PageLayout = styled.main`
  max-width: ${BREAKPOINTS.lg}px;
  margin: 0 auto;
  padding: ${SPACING.lg}px;
  @media (max-width: 767px) { padding: ${SPACING.md}px ${SPACING.sm}px; }
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
