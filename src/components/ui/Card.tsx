import styled from 'styled-components';
import { BORDER_RADIUS, SPACING } from '@/styles/theme';

export const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${BORDER_RADIUS.card}px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: ${SPACING.md}px;
  min-width: 0;
  @media (max-width: 767px) { padding: ${SPACING.sm}px; }
`;
