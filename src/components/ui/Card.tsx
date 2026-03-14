import styled from 'styled-components';
import { BORDER_RADIUS, SPACING } from '@/styles/theme';

export const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: ${BORDER_RADIUS.card}px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: ${SPACING.sm}px ${SPACING.md}px;
`;
