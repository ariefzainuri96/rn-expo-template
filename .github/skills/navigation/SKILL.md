---
name: navigation
description: Expo Router v6 file-based navigation with typed routes. Route groups organize auth, tabs, and feature screens. Auth state drives redirects at the layout level — not inside screen components.
---

# Navigation Pattern

## When to Use
- Add a new screen or route group
- Add a tab to the bottom tab bar
- Implement a modal screen
- Navigate programmatically

## Architecture

    app/
      _layout.tsx          Root Stack (QueryClient + ThemeProvider)
        (auth)/
          _layout.tsx      Stack — redirects to (tabs) if session exists
          login.tsx
        (tabs)/
          _layout.tsx      Tabs — redirects to (auth) if no session
          index.tsx / explore.tsx / profile.tsx
        (news)/
          _layout.tsx      Stack
          index.tsx / detail.tsx
        modal.tsx           Presented as modal

## Core Files

- app/_layout.tsx
- app/(tabs)/_layout.tsx
- app/(auth)/_layout.tsx

## Pattern: Root Layout

    // app/_layout.tsx
    export const unstable_settings = { anchor: "(tabs)" };

    export default function RootLayout() {
        return (
            <QueryClientProvider client={queryClient}>
                <InitialLayout />
                <Toast />
            </QueryClientProvider>
        );
    }

    function InitialLayout() {
        return (
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(news)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        );
    }

## Pattern: Programmatic Navigation

    import { router } from "expo-router";
    router.push("/(news)/detail");  // navigate forward
    router.replace("/(tabs)");       // replace current screen
    router.back();                   // go back
    router.dismissAll();             // dismiss all modals

## Pattern: Typed Route Params

    import { useLocalSearchParams } from "expo-router";
    const { id } = useLocalSearchParams<{ id: string }>();

## Gotchas

- unstable_settings.anchor sets the default tab group so deep links work.
- Redirect in layouts is evaluated on every render; keep it fast (no async).
- router.dismissAll() only works inside a modal stack.
- Route group names (auth), (tabs), (news) are NOT part of the URL path.
- typedRoutes must be enabled in app.json experiments for type-safe hrefs.

## Anti-Patterns

    // Wrong: use React Navigation directly
    import { useNavigation } from "@react-navigation/native";

    // Wrong: conditional rendering instead of Redirect
    if (!session) return <LoginScreen />;

    // Wrong: hardcoded untyped routes
    router.push("/some-screen");
