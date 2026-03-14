import { observer } from 'mobx-react-lite';
import { settingsStore } from '@/store';
import { Button } from '@/components/ui';

export const ThemeToggle = observer(function ThemeToggle() {
  return (
    <Button $variant="secondary" onClick={() => settingsStore.toggleTheme()}>
      {settingsStore.theme === 'light' ? '☀️' : '🌙'}
    </Button>
  );
});
