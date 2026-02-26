# Todo

- [x] Wire a global `QueryClientProvider` + `<Toast />` around the current layout so every screen (login included) can use `react-query` and consistent toasts without re-instantiating clients.
- [x] Extend `context/auth.tsx` + `utils/utils.ts` logout helpers to persist `IS_LOGIN_KEY`, keep `isLoading` in sync, and align with the axios interceptor's expectations.
- [x] Add a clean architecture auth layer (schema, service calling `getAxiosInstance`, and a `useLogin` hook) that encapsulates the login mutation via `react-query` and exposes loading/error state.
- [x] Rebuild `app/(auth)/login.tsx` to match the provided HTML design using `SafeAreaView`, `KeyboardProvider`/`KeyboardStickyView`, NativeWind styling, `LinearGradient` blobs, and a `react-hook-form` powered form that uses the new mutation.
- [x] Install required packages (`react-hook-form`, `@hookform/resolvers/zod`, `expo-linear-gradient`, `react-native-keyboard-controller`) and update tails/palette as needed so the design tokens align with the Figma-inspired style.
- [x] Verify the flow by running `bun run lint` (or `npm run lint`) and exercising the login screen to ensure validation, mutation states, and navigation through `router` behave correctly.
