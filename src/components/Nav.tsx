import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { SPACING } from '@/styles/theme';
import { ThemeToggle } from './ThemeToggle';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.sm}px;
  margin-bottom: ${SPACING.md}px;
  flex-wrap: wrap;
`;

const NavWrap = styled.nav`
  display: flex;
  gap: ${SPACING.sm}px;
  flex-wrap: wrap;
`;

const Link = styled(NavLink)`
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-radius: 6px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};

  &.active {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.surface};
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

export function Nav() {
  return (
    <Header>
      <NavWrap>
        <Link to="/">Главная</Link>
        <Link to="/habits">Привычки</Link>
        <Link to="/stats">Статистика</Link>
        <Link to="/settings">Настройки</Link>
      </NavWrap>
      <ThemeToggle />
    </Header>
  );
}
