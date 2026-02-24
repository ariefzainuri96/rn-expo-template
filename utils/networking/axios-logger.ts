import { IS_LOGIN_KEY, TOKEN_KEY } from '../constant';
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { isValidJSON, logout, showToast } from '../utils';
import { router, usePathname } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

// import { navigationRef, navigationRefDispatch } from '../../App';

export const onRequest = (
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
    const { data, headers } = config;

    // Set Headers Here
    // Check Authentication Here
    // Set Loading Start Here

    // console.log(`Headers: ${JSON.stringify(headers)}`);

    if (data) {
        console.log(`Request: ${JSON.stringify(data)}`);
    }

    return config;
};

export const onErrorResponse = async (
    error: AxiosError | Error,
): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
        const { message, response } = error;
        const { method, url } = error.config as AxiosRequestConfig;
        const { status } = (error.response as AxiosResponse) ?? {};

        console.log(`🚨 [API] ${method?.toUpperCase()} ${url}`);
        console.log(`Status: ${status}`);
        console.log(`Error: ${message}`);
        console.log(`Response:`);

        if (isValidJSON(JSON.stringify(response?.data))) {
            console.log(response?.data);
        }

        /*
            if user has been login, the value of isLogin will be true
        */
        const isLogin = (await AsyncStorage.getItem(IS_LOGIN_KEY)) ?? 'false';
        const isInLogin =
            usePathname() === '/login' ||
            isLogin === 'false';

        /*
            dont show toast or any action if in login
            login state will handle by itself
        */
        if (isInLogin) return Promise.reject(error);

        if (status === 401 || status === 403) {
            // Delete Token & Go To Login Page if you required.
            await logout(response?.data?.message ?? 'Error!');

            // 1. Dismiss every screen currently in the stack
            while (router.canGoBack()) {
                router.dismissAll();
            }

            // 2. Head to login
            // router.replace('');
        } else {
            showToast({
                title: response?.data?.message ?? 'Error!',
                type: 'error',
            });
        }
    } else {
        console.log(`🚨 [API] | Error ${error.message}`);
    }

    return Promise.reject(error);
};

export const onResponse = (response: AxiosResponse): AxiosResponse => {
    const { method, url } = response.config;
    const { status } = response;

    console.log(
        `🚀 [API] ${method?.toUpperCase()} ${url} |\nResponse ${status} => ${JSON.stringify(
            response.data,
        )}`,
    );

    return response;
};

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = async (timeout: number = 10000) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    // const baseUrl =
    //     (await AsyncStorage.getItem(BASE_URL_KEY)) ?? DEFAULT_BASE_URL;
    // const baseUrl = Constants.expoConfig?.extra?.API_BASE_URL;
    const baseUrl = 'base_url';

    if (!axiosInstance) {
        axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        });

        axiosInstance.interceptors.request.use(onRequest, onErrorResponse);
        axiosInstance.interceptors.response.use(onResponse, onErrorResponse);
    }

    axiosInstance.defaults.timeout = timeout;
    axiosInstance.defaults.baseURL = baseUrl;

    if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.Authorization;
    }

    return axiosInstance;
};
