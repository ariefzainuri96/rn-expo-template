# Project Overview: rn-expo-template

## Summary
Production-grade React Native / Expo template (New Architecture enabled). Full feature set: authentication, data fetching, form validation, and styled UI — intended as a bootstrap for new apps.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK ~54, React Native 0.81 (New Arch) |
| Navigation | Expo Router v6 (file-based, typed routes) |
| State Management | Zustand v5 |
| Server State | TanStack React Query v5 |
| HTTP Client | Axios + custom interceptor layer |
| Forms | React Hook Form v7 + Zod v4 |
| Styling | NativeWind v4 (Tailwind CSS) + StyleSheet hybrid |
| Animation | React Native Reanimated v4 |
| Persistence | @react-native-async-storage/async-storage |
| Language | TypeScript 5.9 (strict mode) |

## Folder Structure

    app/          Expo Router pages and layouts
      (auth)/     Unauthenticated route group
      (tabs)/     Authenticated tab layout (session guard)
      (news)/     News feature route group
    components/   Shared UI components
    hooks/        react-query custom hooks
    lib/          query-client.ts singleton
    services/     Pure typed API functions
    stores/       Zustand stores
    utils/        Helpers, constants, axios-logger
    validation/   Zod schemas + TypeScript types

## Skills Map

| Pattern | Skill | Key Files |
|---|---|---|
| Authentication | .github/skills/authentication/SKILL.md | stores/auth.ts, app/(auth)/ |
| API Service Layer | .github/skills/api-service-layer/SKILL.md | utils/networking/axios-logger.ts |
| Form Validation | .github/skills/form-validation/SKILL.md | validation/, app/(auth)/login.tsx |
| Data Fetching | .github/skills/data-fetching/SKILL.md | lib/query-client.ts, hooks/ |
| Styling | .github/skills/styling/SKILL.md | tailwind.config.js, global.css |
| Navigation | .github/skills/navigation/SKILL.md | app/_layout.tsx, app/(tabs)/ |
