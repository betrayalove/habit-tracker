import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { habitsStore } from '@/store';
import { PageLayout } from '@/components/ui';
import { Button, Card } from '@/components/ui';
import { HabitForm, Nav } from '@/components';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';
import type { Habit } from '@/types';

const HabitRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.sm}px;
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: ${SPACING.xs}px;
`;

const HabitInfo = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${SPACING.xs}px;
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${SPACING.xs}px;
`;

const EmptyCard = styled(Card)`
  padding: ${SPACING.lg}px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const GoalLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9em;
`;

export const HabitsPage = observer(function HabitsPage() {
  const [editing, setEditing] = useState<Habit | null>(null);

  return (
    <PageLayout>
      <Nav />
      <h1>Список привычек</h1>
      <HabitForm initial={editing} onSuccess={() => setEditing(null)} />
      {habitsStore.habits.length === 0 ? (
        <EmptyCard>Нет привычек. Добавьте первую привычку выше.</EmptyCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.xs }}>
          {habitsStore.habits.map((h) => (
            <HabitRow key={h.id}>
              <HabitInfo $color={h.color}>
                <span className="dot" />
                <span>{h.icon} {h.name}</span>
                <GoalLabel>(цель: {h.goalPerWeek} раз/нед.)</GoalLabel>
              </HabitInfo>
              <Actions>
                <Button $variant="secondary" onClick={() => setEditing(h)}>
                  Изменить
                </Button>
                <Button $variant="danger" onClick={() => habitsStore.removeHabit(h.id)}>
                  Удалить
                </Button>
              </Actions>
            </HabitRow>
          ))}
        </div>
      )}
    </PageLayout>
  );
});
