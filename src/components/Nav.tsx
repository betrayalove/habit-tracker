import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { SPACING } from '@/styles/theme';
import { ThemeToggle } from './ThemeToggle';

const Header = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: ${SPACING.sm}px;
  margin-bottom: ${SPACING.md}px;
  flex-wrap: wrap;
`;

const NavWrap = styled.nav`
  display: flex;
  gap: ${SPACING.xs}px;
  flex-wrap: wrap;
  min-width: 0;
`;

const Link = styled(NavLink)`
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-radius: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};

  &.active {
    color: ${({ theme }) => theme.link};
    background: ${({ theme }) => theme.mutedSurface};
    text-decoration: none;
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
