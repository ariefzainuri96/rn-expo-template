---
name: data-fetching
description: TanStack React Query v5 for all server state. Custom hooks wrap useMutation and useInfiniteQuery. Singleton QueryClient in lib/query-client.ts is provided at the root layout.
---

# Data Fetching Pattern

## When to Use
- Add any API call that fetches or mutates server data
- Implement infinite scroll / pagination
- Handle loading, error, empty states
- Invalidate or refetch after a mutation

## Architecture

    lib/query-client.ts    singleton config (staleTime, retry)
           |
    app/_layout.tsx        QueryClientProvider wraps entire app
           |
    hooks/use-<feature>.ts useMutation or useInfiniteQuery
           |
    services/<feature>.ts  pure async fetch function

## Core Files

- lib/query-client.ts
- hooks/use-login.ts
- app/(news)/index.tsx

## Pattern: QueryClient Config

    // lib/query-client.ts
    export const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: 1, staleTime: 1000 * 60 },
            mutations: { retry: 0 },
        },
    });

## Pattern: Mutation Hook

    // hooks/use-login.ts
    export const useLogin = () =>
        useMutation<LoginResponse, Error, LoginInput>({
            mutationFn: loginWithEmail,
        });

## Pattern: Infinite Query

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["news", searchQuery],
            queryFn: ({ pageParam }) =>
                fetchNewsArticles({ query: searchQuery, page: pageParam }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                const fetched = allPages.length * NEWS_PAGE_SIZE;
                return fetched < lastPage.totalResults ? allPages.length + 1 : undefined;
            },
        });

## Pattern: FlatList with Infinite Scroll

    <FlatList
        data={data?.pages.flatMap((p) => p.articles)}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => <ArticleCard article={item} />}
        onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
    />

## Gotchas

- Always type useMutation as useMutation<TData, TError, TVariables>.
- Flatten infinite pages with data?.pages.flatMap(p => p.items).
- Use descriptive queryKey arrays: ["news", searchQuery].
- staleTime: 1000 * 60 prevents refetching for 1 min on re-focus.

## Anti-Patterns

    // Wrong: fetching in useEffect
    useEffect(() => { fetch("/api").then(setData); }, []);

    // Wrong: untyped useMutation
    useMutation({ mutationFn: loginWithEmail });

    // Wrong: queryClient.fetchQuery in components
    queryClient.fetchQuery(...); // use hooks
