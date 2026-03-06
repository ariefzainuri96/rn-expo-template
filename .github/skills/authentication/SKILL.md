---
name: authentication
description: Zustand-based session management with AsyncStorage persistence and Expo Router route guards. Covers sign-in, sign-out, and cold-start hydration.
---

# Authentication Pattern

## When to Use
- Add or modify app session state
- Protect a route group (redirect unauthenticated users)
- Persist tokens across app restarts
- Add a new auth method (OAuth, biometrics)

## Architecture

    AsyncStorage (persisted)
           |
           v
    useAuthStore (Zustand)  <-- hydrated on store creation
           |
           v
    route group _layout.tsx  <-- reads session, redirects

## Core Files

- stores/auth.ts
- app/(auth)/_layout.tsx
- app/(tabs)/_layout.tsx
- app/_layout.tsx (splash gate)

## Pattern: Zustand Auth Store

    // stores/auth.ts
    export const useAuthStore = create<AuthState>((set) => {
        const hydrateSession = async () => {
            try {
                const token = await AsyncStorage.getItem(TOKEN_KEY);
                const isLogin = (await AsyncStorage.getItem(IS_LOGIN_KEY)) === "true";
                set({ session: token && isLogin ? token : null, isLoading: false });
            } catch { set({ session: null, isLoading: false }); }
        };
        hydrateSession();
        return {
            session: null, isLoading: true,
            signIn: async (token) => {
                set({ session: token, isLoading: false });
                await Promise.all([AsyncStorage.setItem(TOKEN_KEY, token), AsyncStorage.setItem(IS_LOGIN_KEY, "true")]);
            },
            signOut: async () => {
                set({ session: null, isLoading: false });
                await AsyncStorage.multiRemove([TOKEN_KEY, IS_LOGIN_KEY]);
            },
        };
    });

## Pattern: Authenticated Route Guard

    const session = useAuthStore((state) => state.session);
    if (!session) return <Redirect href="/(auth)/login" />;

## Pattern: Unauthenticated Route Guard

    const session = useAuthStore((state) => state.session);
    if (session) return <Redirect href="/(tabs)" />;

## Pattern: Splash Screen Gate

    const isLoading = useAuthStore((state) => state.isLoading);
    useEffect(() => {
        if (isLoading) return;
        SplashScreen.hideAsync();
    }, [isLoading]);

## Gotchas

- isLoading starts true; gate SplashScreen.hideAsync on it.
- Use AsyncStorage.multiRemove for atomic sign-out.
- Dual-key check prevents stale token reuse.
- Select state slices individually to avoid re-renders.

## Anti-Patterns

    const store = useAuthStore();      // Wrong: subscribes to whole store
    const [tok, setTok] = useState(";"); // Wrong: local state for tokens
    // Wrong: hide splash before hydration
    useEffect(() => { SplashScreen.hideAsync(); }, []);
