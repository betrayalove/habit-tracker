import { observer } from 'mobx-react-lite';
import { PageLayout } from '@/components/ui';
import { Card } from '@/components/ui';
import { Nav, PeriodSwitcher, ThemeToggle } from '@/components';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';

const Section = styled(Card)`
  margin-bottom: ${SPACING.md}px;
`;

const SectionTitle = styled.h2`
  margin-top: 0;
  margin-bottom: ${SPACING.sm}px;
`;

export const SettingsPage = observer(function SettingsPage() {
  return (
    <PageLayout>
      <Nav />
      <h1>Настройки</h1>
      <Section>
        <SectionTitle>Тема</SectionTitle>
        <ThemeToggle />
      </Section>
      <Section>
        <SectionTitle>Период по умолчанию</SectionTitle>
        <PeriodSwitcher />
      </Section>
    </PageLayout>
  );
});
