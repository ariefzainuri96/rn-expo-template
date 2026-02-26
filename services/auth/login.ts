import { LoginInput } from '@/validation/login';
import { getAxiosInstance } from '@/utils/networking/axios-logger';

const LOGIN_ENDPOINT = '/auth/login';

type LoginResponsePayload = {
    token?: string;
    access_token?: string;
    refresh_token?: string;
    refreshToken?: string;
};

export type LoginResponse = {
    token: string;
    refreshToken?: string;
};

export const loginWithEmail = async (
    payload: LoginInput,
): Promise<LoginResponse> => {
    const axiosInstance = await getAxiosInstance();
    const { data } = await axiosInstance.post<LoginResponsePayload>(
        LOGIN_ENDPOINT,
        payload,
    );

    const token = data.token ?? data.access_token;

    if (!token) {
        throw new Error(
            'Login response did not include an authentication token.',
        );
    }

    return {
        token,
        refreshToken: data.refreshToken ?? data.refresh_token,
    };
};
