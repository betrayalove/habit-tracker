# Трекер привычек

## Описание

Трекер привычек — одностраничное приложение (SPA) для учёта ежедневных привычек. Сетка «дни × привычки» с отметками выполнения, управление списком привычек (добавление, редактирование, удаление), статистика и настройки (тема, период отображения). Данные хранятся в браузере (localStorage). Backend не используется.

## Возможности

- Сетка привычек по дням (неделя/месяц) с отметками выполнения
- CRUD привычек (название, цвет, иконка, цель в неделю)
- Статистика по выполнению
- Настройки: светлая/тёмная тема, период (неделя/месяц)
- Сохранение в localStorage

## Стек

- **Framework:** React 18, TypeScript
- **Сборка:** Vite
- **Маршрутизация:** React Router v6
- **Состояние:** MobX (mobx, mobx-react-lite)
- **Стили:** styled-components (тема из src/shared/styles/tokens.ts)
- **Тесты:** Jest, React Testing Library; E2E: Playwright

## Переменные окружения

См. [.env.example](.env.example). В текущей версии проект не требует обязательных переменных.

## Команды

- `npm install` — установка зависимостей
- `npm run dev` — запуск dev-сервера (http://localhost:5173)
- `npm run build` — сборка для продакшена (TypeScript + Vite)
- `npm run preview` — просмотр собранной сборки
- `npm run test` — unit-тесты (Jest)
- `npm run e2e` — E2E (Playwright)
- `npm run e2e:ui` — E2E с UI Playwright

## Авторизация

В проекте нет авторизации; данные хранятся локально в браузере (localStorage).

## Запуск backend

Backend не предусмотрен. Приложение полностью фронтендное.

## Структура проекта

- **src/components** — UI и feature-компоненты (HabitGrid, Nav, HabitForm, ThemeToggle и др.)
- **src/pages** — главная (сетка), список привычек, настройки, статистика
- **src/store** — MobX: HabitsStore, SettingsStore
- **src/styles** — theme.ts (LIGHT_THEME, DARK_THEME, SPACING и др.), GlobalStyles
- **src/shared/styles** — tokens.ts (единые дизайн-токены)
- **src/hooks**, **src/types** — хуки и типы
