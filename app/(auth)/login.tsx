import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    KeyboardProvider,
    KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { LoginInput, loginSchema } from '@/validation/login';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCallback, useMemo } from 'react';

import { AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { LoginResponse } from '@/services/auth/login';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { showToast } from '@/utils/utils';
import { useAuthStore } from '@/stores/auth';
import { useLogin } from '@/hooks/use-login';
import { zodResolver } from '@hookform/resolvers/zod';

const styles = StyleSheet.create({
    gradientLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
    },
    topBlob: {
        position: 'absolute',
        width: 240,
        height: 240,
        borderRadius: 140,
        top: -40,
        right: -60,
        opacity: 0.8,
    },
    bottomBlob: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 120,
        bottom: -80,
        left: -40,
        opacity: 0.75,
    },
    dot: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 100,
        backgroundColor: '#EBE5FF',
    },
    dotOne: {
        top: 40,
        right: 30,
    },
    dotTwo: {
        bottom: 140,
        left: 20,
        width: 10,
        height: 10,
    },
    dotThree: {
        top: 80,
        left: 60,
        width: 8,
        height: 8,
    },

    disabledButton: {
        opacity: 0.75,
    },
});

export default function LoginScreen() {
    const signIn = useAuthStore((state) => state.signIn);
    const loginMutation = useLogin();
    const isSubmitting = loginMutation.isPending;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleLoginSuccess = useCallback(
        (response: LoginResponse) => {
            signIn(response.token);
            router.replace('/(tabs)');
        },
        [signIn],
    );

    const handleLoginError = useCallback((error: unknown) => {
        const message =
            error instanceof AxiosError
                ? (error.response?.data?.message ?? error.message)
                : 'Unable to sign in. Please try again.';
        showToast({
            type: 'error',
            title: 'Login failed',
            message,
        });
    }, []);

    const handleLogin = useCallback<SubmitHandler<LoginInput>>(
        (values) => {
            loginMutation.mutate(values, {
                onSuccess: handleLoginSuccess,
                onError: handleLoginError,
            });
        },
        [handleLoginError, handleLoginSuccess, loginMutation],
    );

    const handleForgotPassword = useCallback(() => {
        showToast({
            type: 'info',
            title: 'Coming soon',
            message: 'Forgot password flow is not implemented yet.',
        });
    }, []);

    const submitForm = useMemo(
        () => handleSubmit(handleLogin),
        [handleSubmit, handleLogin],
    );

    return (
        <SafeAreaView className='flex-1 bg-background-light dark:bg-background-dark'>
            <KeyboardProvider>
                <View className='relative flex-1'>
                    <View style={styles.gradientLayer}>
                        <LinearGradient
                            colors={['#5D3FD3', '#7C3AED', '#D8B4FE']}
                            style={styles.topBlob}
                        />
                        <LinearGradient
                            colors={['#A78BFA', '#E0E7FF']}
                            style={styles.bottomBlob}
                        />
                        <View style={[styles.dot, styles.dotOne]} />
                        <View style={[styles.dot, styles.dotTwo]} />
                        <View style={[styles.dot, styles.dotThree]} />
                    </View>
                    <View
                        id='main-container'
                        className='justify-center flex-1 px-6'
                    >
                        {/* icon */}
                        <View className='items-center mb-10'>
                            <View className='flex items-center justify-center w-24 h-24 mb-2 rounded-full bg-accent-purple-light'>
                                <MaterialIcons
                                    name='person'
                                    size={40}
                                    color='#5D3FD3'
                                />
                            </View>
                        </View>
                        {/* welcome text */}
                        <View className='mb-8 text-center'>
                            <Text className='mb-2 text-3xl font-bold text-slate-900 dark:text-white'>
                                Welcome
                            </Text>
                            <Text className='text-base font-normal text-slate-500 dark:text-slate-300'>
                                Enter your email to sign in or create an account
                            </Text>
                        </View>
                        {/* form */}
                        <View className='space-y-5'>
                            <View className='space-y-2'>
                                <Text className='text-sm font-semibold text-slate-900 dark:text-slate-200'>
                                    Email Address
                                </Text>
                                <Controller
                                    control={control}
                                    name='email'
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <TextInput
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            placeholder='name@company.com'
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                            autoComplete='email'
                                            className='block w-full h-12 px-4 text-base bg-white border rounded-lg shadow-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary placeholder:text-slate-400'
                                        />
                                    )}
                                />
                                {errors.email?.message && (
                                    <Text className='text-xs text-red-500'>
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>
                            <View className='mt-4 space-y-2'>
                                <View className='flex-row items-center justify-between'>
                                    <Text className='text-sm font-semibold text-slate-900 dark:text-slate-200'>
                                        Password
                                    </Text>
                                </View>
                                <Controller
                                    control={control}
                                    name='password'
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <TextInput
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            placeholder='••••••••'
                                            secureTextEntry
                                            autoCapitalize='none'
                                            className='block w-full h-12 px-4 text-base bg-white border rounded-lg shadow-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary placeholder:text-slate-400'
                                        />
                                    )}
                                />
                                {errors.password?.message && (
                                    <Text className='text-xs text-red-500'>
                                        {errors.password.message}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    onPress={handleForgotPassword}
                                    className='flex-row justify-end mt-4'
                                >
                                    <Text className='text-sm font-medium text-primary dark:text-accent-purple-hover'>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* submit button */}
                        <KeyboardStickyView>
                            <TouchableOpacity
                                onPress={submitForm}
                                disabled={isSubmitting}
                                className='flex items-center justify-center w-full h-12 mt-8 text-base font-semibold text-white rounded-lg shadow-sm bg-primary hover:bg-accent-purple-hover'
                                style={
                                    isSubmitting
                                        ? styles.disabledButton
                                        : undefined
                                }
                                activeOpacity={0.8}
                            >
                                <Text className='text-lg font-bold text-white'>
                                    {isSubmitting
                                        ? 'Signing in...'
                                        : 'Continue with Email'}
                                </Text>
                            </TouchableOpacity>
                        </KeyboardStickyView>
                    </View>
                </View>
            </KeyboardProvider>
        </SafeAreaView>
    );
}
