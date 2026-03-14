import styled from 'styled-components';
import { BORDER_RADIUS, SPACING } from '@/styles/theme';

export const Input = styled.input`
  width: 100%;
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-radius: ${BORDER_RADIUS.button}px;
  border: 1px solid ${({ theme }) => theme.secondary};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;
