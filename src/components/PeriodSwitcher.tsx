import { observer } from 'mobx-react-lite';
import { settingsStore } from '@/store';
import { Button } from '@/components/ui';
import styled from 'styled-components';
import { SPACING } from '@/styles/theme';
import type { PeriodType } from '@/types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm}px;
  flex-wrap: wrap;
`;

export const PeriodSwitcher = observer(function PeriodSwitcher() {
  const setPeriod = (p: PeriodType) => settingsStore.setPeriod(p);
  return (
    <Wrapper>
      <Button $variant={settingsStore.period === 'week' ? 'primary' : 'secondary'} onClick={() => setPeriod('week')}>
        Неделя
      </Button>
      <Button $variant={settingsStore.period === 'month' ? 'primary' : 'secondary'} onClick={() => setPeriod('month')}>
        Месяц
      </Button>
    </Wrapper>
  );
});
