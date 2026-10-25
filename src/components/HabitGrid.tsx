import { observer } from 'mobx-react-lite';
import { habitsStore, settingsStore } from '@/store';
import { Card } from '@/components/ui';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';
import { dateKey, getDaysForPeriod } from '@/shared/lib/dates';

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
  const days = getDaysForPeriod(period, periodOffset);
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
            <HabitRow key={h.id} role="group" aria-label={`Отметки: ${h.name}`}>
              <HabitLabel $color={h.color} style={{ minWidth: 120 }}>
                <span className="dot" />
                <span>{h.icon} {h.name}</span>
              </HabitLabel>
              <DaysRow>
                {days.map((d) => {
                  const done = habitsStore.isDone(h.id, d);
                  const disabled = dateKey(d) > dateKey(new Date());
                  return (
                    <DayCell key={dateKey(d)}>
                      <DayLabel>{d.getDate()}</DayLabel>
                      <CellCheck
                        $done={done}
                        aria-pressed={done}
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
