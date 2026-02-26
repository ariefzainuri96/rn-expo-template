import { LoginResponse, loginWithEmail } from '@/services/auth/login';

import { LoginInput } from '@/validation/login';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () =>
    useMutation<LoginResponse, Error, LoginInput>({
        mutationFn: loginWithEmail,
    });
