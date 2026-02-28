import {
    NEWS_PAGE_SIZE,
    NewsArticle,
    fetchNewsArticles,
} from '@/services/news';
import { NewsSearchInput, newsSearchSchema } from '@/validation/news';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    FlatList,
    ListRenderItemInfo,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_QUERY = 'tech';

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

// ─── Article Card ────────────────────────────────────────────────────────────

type ArticleCardProps = {
    article: NewsArticle;
};

function ArticleCard({ article }: ArticleCardProps) {
    return (
        <View
            className='flex-row bg-white rounded-[12px] overflow-hidden'
            style={nativeStyles.cardShadow}
        >
            <Image
                style={{ width: 80, height: 80 }}
                source={{ uri: article.urlToImage ?? undefined }}
                contentFit='cover'
                placeholder={BLURHASH}
                recyclingKey={article.url}
            />
            <View className='flex-1 p-3 gap-1.5 justify-center'>
                <Text
                    className='text-[14px] font-semibold text-slate-900 leading-5'
                    numberOfLines={2}
                >
                    {article.title}
                </Text>
                <Text className='text-[12px] text-slate-500' numberOfLines={1}>
                    {article.author ?? article.source.name}
                </Text>
            </View>
        </View>
    );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NewsIndex() {
    const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<NewsSearchInput>({
        resolver: zodResolver(newsSearchSchema),
        defaultValues: { query: DEFAULT_QUERY },
    });

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['news', searchQuery],
        queryFn: ({ pageParam = 1 }) =>
            fetchNewsArticles({
                query: searchQuery,
                page: pageParam as number,
                pageSize: NEWS_PAGE_SIZE,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const fetched = allPages.length * NEWS_PAGE_SIZE;
            return fetched < lastPage.totalResults
                ? allPages.length + 1
                : undefined;
        },
    });

    const articles = data?.pages.flatMap((page) => page.articles) ?? [];

    const onSubmit = useCallback((input: NewsSearchInput) => {
        setSearchQuery(input.query);
    }, []);

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<NewsArticle>) => (
            <ArticleCard article={item} />
        ),
        [],
    );

    const keyExtractor = useCallback((item: NewsArticle) => `${item.urlToImage}${item.url}${item.publishedAt}`, []);

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const ListFooter = useCallback(() => {
        if (!isFetchingNextPage) return null;
        return <ActivityIndicator color='#5D3FD3' />;
    }, [isFetchingNextPage]);

    const ListEmpty = useCallback(() => {
        if (isLoading) return null;
        return (
            <View>
                <Text>
                    {isError
                        ? 'Failed to load news. Please try again.'
                        : 'No articles found.'}
                </Text>
            </View>
        );
    }, [isLoading, isError]);

    return (
        <SafeAreaView className='flex-1 bg-background-light' edges={['bottom']}>
            {/* Search Bar */}
            <View className='flex-row gap-2 px-4 mt-3 mb-3'>
                <Controller
                    control={control}
                    name='query'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`flex-1 h-11 rounded-[10px] border px-[14px] bg-white text-[15px] text-slate-900 ${
                                errors.query
                                    ? 'border-red-500'
                                    : 'border-[#EBE5FF]'
                            }`}
                            placeholder='Search news…'
                            placeholderTextColor='#9BA1A6'
                            returnKeyType='search'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            onSubmitEditing={handleSubmit(onSubmit)}
                        />
                    )}
                />
                <Pressable
                    className='h-11 px-[18px] rounded-[10px] bg-[#5D3FD3] justify-center items-center'
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className='text-white font-semibold text-[15px]'>
                        Search
                    </Text>
                </Pressable>
            </View>
            {errors.query && (
                <Text className='text-red-500 text-[12px] px-4 -mt-1.5 mb-1'>
                    {errors.query.message}
                </Text>
            )}

            {/* Loading state (first fetch) */}
            {isLoading && (
                <ActivityIndicator
                    className='self-center flex-1'
                    size='large'
                    color='#5D3FD3'
                />
            )}

            {/* Article list */}
            {!isLoading && (
                <FlatList
                    data={articles}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={ListFooter}
                    ListEmptyComponent={ListEmpty}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 24,
                        gap: 12,
                    }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const nativeStyles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
});
