import { Dimensions, PixelRatio } from 'react-native';
import Toast, { ToastType } from 'react-native-toast-message';
import { IS_LOGIN_KEY, TOKEN_KEY } from './constant';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type TDebounceTextChange = {
    ref: React.RefObject<ReturnType<typeof setTimeout> | null>;
    debounceTime?: number;
    callback: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Use whichever is smaller, width or height
const SCALE = SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;

// Base width for scaling calculations
const BASE_WIDTH = 375;

// Configuration object for fine-tuning text sizes
const fontConfig = {
    phone: {
        small: { min: 0.8, max: 1 },
        medium: { min: 0.9, max: 1.1 },
        large: { min: 1, max: 1.2 },
    },
    tablet: {
        small: { min: 1.3, max: 1.4 },
        medium: { min: 1.4, max: 1.5 },
        large: { min: 1.5, max: 1.7 },
    },
};

// Helper function to get device type
export const getDeviceType = (): 'phone' | 'tablet' => {
    const pixelDensity = PixelRatio.get();
    const adjustedWidth = SCREEN_WIDTH * pixelDensity;
    const adjustedHeight = SCREEN_HEIGHT * pixelDensity;

    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return 'tablet';
    } else if (
        pixelDensity === 2 &&
        (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    ) {
        return 'tablet';
    } else {
        return 'phone';
    }
};

// Helper function to determine screen size category
const getScreenSizeCategory = (): 'small' | 'medium' | 'large' => {
    if (SCALE < 350) return 'small';
    if (SCALE > 500) return 'large';
    return 'medium';
};

export const getComponentSize = (size: number): number => {
    const deviceType = getDeviceType();
    const screenCategory = getScreenSizeCategory();
    const config = fontConfig[deviceType][screenCategory];

    // Calculate the scale factor
    const scaleFactor = SCALE / BASE_WIDTH;

    // Clamp the scale factor between the configured min and max
    const clampedScaleFactor = Math.min(
        Math.max(scaleFactor, config.min),
        config.max,
    );

    return size * clampedScaleFactor;
};

export const getFontSize = (size: number): number => {
    const deviceType = getDeviceType();
    const screenCategory = getScreenSizeCategory();
    const config = fontConfig[deviceType][screenCategory];

    // Calculate the scale factor
    const scaleFactor = SCALE / BASE_WIDTH;

    // Clamp the scale factor between the configured min and max
    const clampedScaleFactor = Math.min(
        Math.max(scaleFactor, config.min),
        config.max,
    );

    // Calculate the new size
    let newSize = size * clampedScaleFactor;

    // Additional scaling for tablets to ensure text isn't too small
    if (deviceType === 'tablet') {
        newSize *= 1.1; // Increase tablet font sizes by an additional 10%
    }

    // Round the size and adjust for the device's font scale
    return (
        Math.round(PixelRatio.roundToNearestPixel(newSize)) /
        PixelRatio.getFontScale()
    );
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatHealthConnectDate(dateString?: string): string {
    let date = new Date(dateString ?? new Date().toISOString());

    if (isNaN(date.getTime())) {
        date = new Date(new Date().toISOString());
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function reffKeyDate(): string {
    let date = new Date(new Date().toISOString());

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}

export const formatDate = (dateString: string) => {
    // Parse the input date string
    const date = new Date(dateString);

    // Define month names
    const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];

    // Extract day, month, and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Return formatted date
    return `${day} ${month} ${year}`;
};

export function debounceTextChange({
    ref,
    debounceTime = 600,
    callback,
}: TDebounceTextChange) {
    // Clear any existing timeout
    if (ref.current) {
        clearTimeout(ref.current);
    }

    // Set a new timeout
    ref.current = setTimeout(() => {
        callback();
        ref.current = null; // Clear the timeout reference
    }, debounceTime); // Debounce delay in milliseconds
}

export function generateRandomNumbers(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }

    return result;
}

export function isValidJSON(response: string): boolean {
    try {
        const parsed = JSON.parse(response);
        // Ensure the parsed result is an object or array
        return typeof parsed === 'object' && parsed !== null;
    } catch {
        return false;
    }
}

export async function logout(customMessage?: string) {
    // remove auth tokens and login flag
    await AsyncStorage.multiRemove([TOKEN_KEY, IS_LOGIN_KEY]);

    showToast({
        title: customMessage ?? 'Logged out successfully',
        type: 'success',
    });
}

// Function to scale font size based on screen width
export const scaleFontSize = (size: number): number => {
    return getFontSize(size);
};

export async function showToast({
    title,
    type,
    message,
    visibilityTime,
    autoHide,
}: {
    type: ToastType;
    title?: string;
    message?: string;
    visibilityTime?: number;
    autoHide?: boolean;
}) {
    Toast.show({
        type: type,
        text1: title,
        text2: message,
        autoHide: autoHide,
        visibilityTime: visibilityTime,
        topOffset: Constants.statusBarHeight + 16,
        text1Style: {
            fontFamily: 'Nunito700',
            fontSize: scaleFontSize(14),
            color: '#263238',
        },
        text2Style: {
            fontFamily: 'Nunito400',
            fontSize: scaleFontSize(12),
            color: '#263238',
        },
    });
}

export function capitalizeWords(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
