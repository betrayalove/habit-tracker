import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { habitsStore, settingsStore } from '@/store';
import { Card } from '@/components/ui';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';
import type { PeriodType } from '@/types';

function dateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isFutureDay(d: Date): boolean {
  const today = dateOnly(new Date());
  return dateOnly(d) > today;
}

function getDaysForPeriod(period: PeriodType, offset: number): Date[] {
  const days: Date[] = [];
  const now = new Date();
  if (period === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - start.getDay() + 1 + offset * 7);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
  } else {
    const year = now.getFullYear();
    const month = now.getMonth() + offset;
    const m = ((month % 12) + 12) % 12;
    const y = year + Math.floor(month / 12);
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const start = new Date(first);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(last);
    end.setDate(end.getDate() + (6 - end.getDay()));
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
  }
  return days;
}

const GridWrap = styled.div`
  margin-top: ${SPACING.md}px;
`;

const DaysRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.sm}px;
  align-items: flex-start;
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${SPACING.xs}px;
  min-width: 36px;
`;

const DayLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1.2;
  text-align: center;
`;

const HabitRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${SPACING.sm}px;
  padding: ${SPACING.sm}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};
  flex-wrap: wrap;
`;

const CellCheck = styled.button<{ $done?: boolean; $disabled?: boolean }>`
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 6px;
  border: 2px solid ${({ theme, $done, $disabled }) =>
    $disabled ? theme.textSecondary : $done ? theme.primary : theme.secondary};
  background: ${({ theme, $done, $disabled }) =>
    $disabled ? theme.surface : $done ? theme.primary : 'transparent'};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

const HabitLabel = styled.div<{ $color: string }>`
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

const EmptyCard = styled(Card)`
  padding: ${SPACING.lg}px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

export const HabitGrid = observer(function HabitGrid({
  periodOffset,
  onPrev,
  onNext,
  periodLabel,
}: {
  periodOffset: number;
  onPrev: () => void;
  onNext: () => void;
  periodLabel: string;
}) {
  const period = settingsStore.period;
  const days = useMemo(() => getDaysForPeriod(period, periodOffset), [period, periodOffset]);
  const habits = habitsStore.habits;

  return (
    <GridWrap>
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' }}>
        <button type="button" onClick={onPrev} aria-label="Предыдущий период">
          ←
        </button>
        <span style={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>{periodLabel}</span>
        <button type="button" onClick={onNext} aria-label="Следующий период">
          →
        </button>
      </div>
      {habits.length === 0 ? (
        <EmptyCard>Нет привычек. Добавьте первую привычку в разделе «Список привычек».</EmptyCard>
      ) : (
        <>
          {habits.map((h) => (
            <HabitRow key={h.id}>
              <HabitLabel $color={h.color} style={{ minWidth: 120 }}>
                <span className="dot" />
                <span>{h.icon} {h.name}</span>
              </HabitLabel>
              <DaysRow>
                {days.map((d) => {
                  const done = habitsStore.isDone(h.id, d);
                  const disabled = isFutureDay(d);
                  return (
                    <DayCell key={d.toISOString()}>
                      <DayLabel>{d.getDate()}</DayLabel>
                      <CellCheck
                        $done={done}
                        $disabled={disabled}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && habitsStore.toggleDay(h.id, d)}
                        aria-label={
                          disabled
                            ? `${d.getDate()}.${d.getMonth() + 1} — будущая дата`
                            : `${d.getDate()}.${d.getMonth() + 1} ${done ? 'выполнено' : 'не выполнено'}`
                        }
                      >
                        {done ? '✓' : ''}
                      </CellCheck>
                    </DayCell>
                  );
                })}
              </DaysRow>
            </HabitRow>
          ))}
        </>
      )}
    </GridWrap>
  );
});
