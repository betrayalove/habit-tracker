import { useState } from 'react';
import { dateKey, getStreak, weeklyProgress } from '@/shared/lib/dates';
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
  const doneDates = habit ? habitsStore.getDoneDates(habit.id).filter((day) => day <= dateKey(new Date())) : [];
  const progress = weeklyProgress(doneDates);
  const streak = getStreak(doneDates);

  return (
    <PageLayout>
      <Nav />
      <h1>Статистика</h1>
      <Section>
        <h2>Выберите привычку</h2>
        <select
          aria-label="Выберите привычку"
          value={validId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: SPACING.xs, borderRadius: 8, width: '100%', maxWidth: 400 }}
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
          <p>Цель на эту неделю: <strong>{progress}/{habit.goalPerWeek}</strong> {progress >= habit.goalPerWeek ? '— достигнута' : '— в процессе'}</p>
          <p>Текущая серия (streak): <strong>{streak}</strong> дней подряд</p>
        </Section>
      )}
    </PageLayout>
  );
});
