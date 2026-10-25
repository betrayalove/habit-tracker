import { observer } from 'mobx-react-lite';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { habitsStore, settingsStore } from '@/store';
import { LIGHT_THEME, DARK_THEME } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { MainPage, HabitsPage, SettingsPage, StatsPage } from '@/pages';
import styled from 'styled-components';

const PageBackground = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;

const AppRoutes = observer(function AppRoutes() {
  const theme = settingsStore.theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <PageBackground>
        {(habitsStore.storageError || settingsStore.storageError) && <p role="alert">{habitsStore.storageError || settingsStore.storageError}</p>}
        {habitsStore.legacyImported && <p role="note">Старые отметки перенесены с исходными датами. Из-за ошибки часового пояса в прежней версии некоторые дни могут быть смещены; проверьте их в календаре. Резервная копия сохранена в браузере.</p>}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </PageBackground>
    </ThemeProvider>
  );
});

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
