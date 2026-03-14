import styled from 'styled-components';
import { BORDER_RADIUS, SPACING } from '@/styles/theme';

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-radius: ${BORDER_RADIUS.button}px;
  border: none;
  font-weight: 500;
  transition: opacity 0.2s, transform 0.1s;

  ${({ $variant = 'primary', theme }) => {
    if ($variant === 'primary') {
      return `
        background: ${theme.primary};
        color: white;
      `;
    }
    if ($variant === 'secondary') {
      return `
        background: ${theme.surface};
        color: ${theme.text};
        box-shadow: ${theme.shadow};
      `;
    }
    if ($variant === 'danger') {
      return `
        background: ${theme.error};
        color: white;
      `;
    }
    return '';
  }}

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
