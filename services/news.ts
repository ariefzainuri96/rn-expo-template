import axios from 'axios';

const NEWS_API_KEY = '283aa3b2dcae485ea52c001ea4ba2928';
const NEWS_BASE_URL = 'https://newsapi.org/v2/everything';

export const NEWS_PAGE_SIZE = 6;

export type NewsSource = {
    id: string | null;
    name: string;
};

export type NewsArticle = {
    source: NewsSource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
};

export type NewsResponse = {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
};

export type FetchNewsParams = {
    query: string;
    page: number;
    pageSize?: number;
};

export const fetchNewsArticles = async ({
    query,
    page,
    pageSize = NEWS_PAGE_SIZE,
}: FetchNewsParams): Promise<NewsResponse> => {
    const { data } = await axios.get<NewsResponse>(NEWS_BASE_URL, {
        headers: {
            'X-Api-Key': NEWS_API_KEY,
        },
        params: {
            q: query,
            sortBy: 'publishedAt',
            page,
            pageSize,
        },
    });

    if (data.status !== 'ok') {
        throw new Error('News API returned a non-ok status.');
    }

    return data;
};
