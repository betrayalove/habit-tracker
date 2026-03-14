import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { habitsStore } from '@/store';
import { PageLayout } from '@/components/ui';
import { Card } from '@/components/ui';
import { Nav } from '@/components';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';

const Section = styled(Card)`
  margin-bottom: ${SPACING.md}px;
`;

const EmptySection = styled(Section)`
  padding: ${SPACING.lg}px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

function getStreak(doneDates: string[]): number {
  if (doneDates.length === 0) return 0;
  const sorted = [...doneDates].sort();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let expect = today;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i] === expect) {
      streak++;
      const d = new Date(expect);
      d.setDate(d.getDate() - 1);
      expect = d.toISOString().slice(0, 10);
    } else if (sorted[i] < expect) {
      break;
    }
  }
  return streak;
}

export const StatsPage = observer(function StatsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const habits = habitsStore.habits;

  if (habits.length === 0) {
    return (
      <PageLayout>
        <Nav />
        <h1>Статистика</h1>
        <EmptySection>Нет привычек. Добавьте привычки в разделе «Список привычек».</EmptySection>
      </PageLayout>
    );
  }

  const validId = selectedId && habits.some((h) => h.id === selectedId) ? selectedId : habits[0].id;
  const habit = habitsStore.getHabit(validId);
  const doneDates = habit ? habitsStore.getDoneDates(habit.id) : [];
  const streak = getStreak(doneDates);

  return (
    <PageLayout>
      <Nav />
      <h1>Статистика</h1>
      <Section>
        <h2>Выберите привычку</h2>
        <select
          value={validId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: SPACING.xs, borderRadius: 6, minWidth: 200 }}
        >
          {habits.map((h) => (
            <option key={h.id} value={h.id}>
              {h.icon} {h.name}
            </option>
          ))}
        </select>
      </Section>
      {habit && (
        <Section>
          <h2>{habit.icon} {habit.name}</h2>
          <p>Выполнено дней за всё время: <strong>{doneDates.length}</strong></p>
          <p>Текущая серия (streak): <strong>{streak}</strong> дней подряд</p>
        </Section>
      )}
    </PageLayout>
  );
});
