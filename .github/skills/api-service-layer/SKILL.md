---
name: api-service-layer
description: Typed Axios service functions with centralized interceptors. Each feature has its own file returning typed Promises. Error handling, 401/403 auto-logout, and toast notifications live in the interceptors.
---

# API Service Layer Pattern

## When to Use
- Add a new API endpoint
- Modify auth headers or global error behavior
- Debug network errors or response mapping

## Architecture

    services/<feature>.ts
           |  calls
           v
    getAxiosInstance()  (utils/networking/axios-logger.ts)
           |  attaches interceptors
           v
    Axios HTTP request
           |  on error:
    onErrorResponse  --> 401/403: auto-logout
                     --> other: toast

## Core Files

- utils/networking/axios-logger.ts
- services/auth/login.ts
- services/news.ts (public API, no auth token)

## Pattern: Typed Service Function

    // services/auth/login.ts
    export const loginWithEmail = async (payload: LoginInput): Promise<LoginResponse> => {
        const axiosInstance = await getAxiosInstance();
        const { data } = await axiosInstance.post<LoginResponsePayload>("/auth/login", payload);
        const token = data.token ?? data.access_token;
        if (!token) throw new Error("Login response did not include an authentication token.");
        return { token, refreshToken: data.refreshToken ?? data.refresh_token };
    };

## Pattern: Error Interceptor

    // utils/networking/axios-logger.ts
    export const onErrorResponse = async (error) => {
        if (axios.isAxiosError(error)) {
            const { status } = error.response ?? {};
            const isLogin = (await AsyncStorage.getItem(IS_LOGIN_KEY)) ?? "false";
            if (isLogin === "false") return Promise.reject(error);
            if (status === 401 || status === 403) {
                await logout(error.response?.data?.message ?? "Session expired");
            } else {
                showToast({ title: error.response?.data?.message ?? "Error" });
            }
        }
        return Promise.reject(error);
    };

## Gotchas

- Service functions must be pure async — no hooks, no side-effects.
- Normalize response shapes in the service layer (token ?? access_token).
- Skip global error toast when IS_LOGIN_KEY is false (login screen handles its own errors).
- Always use axios.isAxiosError(error) before accessing .response.

## Anti-Patterns

    // Wrong: raw axios in a component
    const { data } = await axios.get("/endpoint");

    // Wrong: response normalization in a hook or component
    const token = data.token ?? data.access_token;

    // Wrong: generic error with no message
    if (!token) throw new Error();
