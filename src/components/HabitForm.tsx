import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { habitsStore } from '@/store';
import { Button, Card, Input } from '@/components/ui';
import { SPACING } from '@/styles/theme';
import styled from 'styled-components';
import type { Habit } from '@/types';

const FORM_COLORS = ['#2563eb', '#22c55e', '#eab308', '#f97316', '#ec4899', '#8b5cf6'];
const FORM_ICONS = ['📖', '🏃', '💧', '🥗', '😴', '✏️'];

const FormLayout = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm}px;
  margin-bottom: ${SPACING.md}px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.xs}px;
  align-items: center;
`;

const ColorDot = styled.button<{ $color: string; $active?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  cursor: pointer;
`;

const IconBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 2px solid ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  background: ${({ theme }) => theme.surface};
  font-size: 1.2rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.error};
  margin: 0;
`;

interface HabitFormProps {
  initial?: Habit | null;
  onSuccess?: () => void;
}

export const HabitForm = observer(function HabitForm({ initial, onSuccess }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? FORM_COLORS[0]);
  const [icon, setIcon] = useState(initial?.icon ?? FORM_ICONS[0]);
  const [goalPerWeek, setGoalPerWeek] = useState(initial?.goalPerWeek ?? 5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setColor(initial.color);
      setIcon(initial.icon);
      setGoalPerWeek(initial.goalPerWeek);
    } else {
      setName('');
      setColor(FORM_COLORS[0]);
      setIcon(FORM_ICONS[0]);
      setGoalPerWeek(5);
    }
  }, [initial?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Введите название привычки');
      return;
    }
    if (!Number.isInteger(goalPerWeek) || goalPerWeek < 1 || goalPerWeek > 7) {
      setError('Укажите цель от 1 до 7 раз в неделю');
      return;
    }
    if (initial) {
      habitsStore.updateHabit(initial.id, { name: trimmed, color, icon, goalPerWeek });
    } else {
      habitsStore.addHabit({ name: trimmed, color, icon, goalPerWeek });
    }
    if (!initial) {
      setName('');
      setColor(FORM_COLORS[0]);
      setIcon(FORM_ICONS[0]);
      setGoalPerWeek(5);
    }
    onSuccess?.();
  };

  return (
    <FormLayout as="form" onSubmit={handleSubmit}>
      <Input
        placeholder="Название привычки"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Название привычки"
      />
      <Row>
        <span>Цвет:</span>
        {FORM_COLORS.map((c) => (
          <ColorDot key={c} type="button" $color={c} $active={color === c} onClick={() => setColor(c)} aria-label={`Цвет ${c}`} aria-pressed={color === c} />
        ))}
      </Row>
      <Row>
        <span>Иконка:</span>
        {FORM_ICONS.map((i) => (
          <IconBtn key={i} type="button" $active={icon === i} onClick={() => setIcon(i)} aria-label={`Иконка ${i}`} aria-pressed={icon === i}>
            {i}
          </IconBtn>
        ))}
      </Row>
      <Row>
        <label htmlFor="goal-per-week">Цель (раз в неделю):</label>
        <input
          id="goal-per-week"
          type="number"
          min={1}
          max={7}
          value={goalPerWeek}
          onChange={(e) => setGoalPerWeek(Number(e.target.value) || 1)}
          style={{ width: 60, padding: 8, borderRadius: 6 }}
        />
      </Row>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <Button type="submit" $variant="primary">
        {initial ? 'Сохранить' : 'Добавить привычку'}
      </Button>
    </FormLayout>
  );
});
