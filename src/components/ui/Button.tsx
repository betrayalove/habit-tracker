import styled from 'styled-components';
import { BORDER_RADIUS, SPACING } from '@/styles/theme';

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  min-height: 44px;
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-radius: ${BORDER_RADIUS.button}px;
  border: 1px solid transparent;
  font-weight: 600;
  transition: transform 0.1s;
  ${({ $variant = 'primary', theme }) => {
    if ($variant === 'secondary') return `background: ${theme.mutedSurface}; color: ${theme.text}; border-color: ${theme.border};`;
    if ($variant === 'danger') return `background: ${theme.dangerBackground}; color: white;`;
    return `background: ${theme.primary}; color: white;`;
  }}
  &:hover:not(:disabled) { filter: brightness(0.95); }
  &:active:not(:disabled) { transform: translateY(1px); }
  &:disabled { opacity: 0.6; }
`;
