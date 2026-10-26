import { observer } from 'mobx-react-lite';
import { habitsStore, settingsStore } from '@/store';
import { Button, Card } from '@/components/ui';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';
import { dateKey, getDaysForPeriod } from '@/shared/lib/dates';

const GridWrap = styled.div`
  margin-top: ${SPACING.md}px;
  padding: ${SPACING.md}px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.surface};
  @media (max-width: 767px) { padding: ${SPACING.sm}px; }
`;

const DaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${SPACING.xs}px;
  align-items: flex-start;
  width: 100%;
  max-width: 356px;
  min-width: 0;
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${SPACING.xs}px;
  min-width: 0;
`;

const DayLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1.2;
  text-align: center;
`;

const HabitRow = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 300px) minmax(0, 356px);
  align-items: flex-start;
  gap: ${SPACING.sm}px;
  padding: ${SPACING.sm}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  @media (max-width: 767px) { grid-template-columns: minmax(0, 1fr); }
`;

const CellCheck = styled.button<{ $done?: boolean; $disabled?: boolean }>`
  width: 100%;
  max-width: 40px;
  height: 40px;
  min-width: 0;
  padding: 0;
  border-radius: 8px;
  border: 2px solid ${({ theme, $done, $disabled }) =>
    $disabled ? theme.textSecondary : $done ? theme.primary : theme.textSecondary};
  background: ${({ theme, $done, $disabled }) =>
    $disabled ? theme.mutedSurface : $done ? theme.primary : theme.surface};
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
  min-width: 0;
  .dot {
    flex-shrink: 0;
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
        <Button $variant="secondary" type="button" onClick={onPrev} aria-label="Предыдущий период">
          ←
        </Button>
        <span style={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>{periodLabel}</span>
        <Button $variant="secondary" type="button" onClick={onNext} aria-label="Следующий период">
          →
        </Button>
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
