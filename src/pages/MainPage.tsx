import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { PageLayout } from '@/components/ui';
import { HabitGrid, Nav, PeriodSwitcher } from '@/components';
import { usePeriodLabel } from '@/hooks/usePeriodLabel';

export const MainPage = observer(function MainPage() {
  const [periodOffset, setPeriodOffset] = useState(0);
  const periodLabel = usePeriodLabel(periodOffset);

  return (
    <PageLayout>
      <Nav />
      <h1>Трекер привычек</h1>
      <PeriodSwitcher />
      <HabitGrid
        periodOffset={periodOffset}
        periodLabel={periodLabel}
        onPrev={() => setPeriodOffset((o) => o - 1)}
        onNext={() => setPeriodOffset((o) => o + 1)}
      />
    </PageLayout>
  );
});
