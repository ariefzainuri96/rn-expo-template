---
name: styling
description: NativeWind v4 (Tailwind CSS) is the primary approach. Complex or performance-critical styles use StyleSheet. Custom tokens (colors, fonts) are in tailwind.config.js and constants/theme.ts.
---

# Styling Pattern

## When to Use
- Style any component or screen
- Add new design tokens (colors, spacing, fonts)
- Handle dark mode or platform-specific styles

## Core Files

- tailwind.config.js   Custom tokens: colors, font families, border-radius
- global.css           Tailwind base imports (imported once in root _layout.tsx)
- nativewind-env.d.ts  TypeScript support for className prop
- constants/theme.ts   Colors + Fonts for navigation theming (imperative use)

## Primary: NativeWind className

    // Use Tailwind utilities directly on RN components
    <View className="flex-1 bg-background-light px-4 py-6">
        <Text className="text-[14px] font-semibold text-slate-900 leading-5">
            Hello
        </Text>
    </View>

## Secondary: StyleSheet for shadows and dynamic values

    const styles = StyleSheet.create({
        cardShadow: {
            shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
        },
    });
    <View className="bg-white rounded-[12px]" style={styles.cardShadow} />

## Custom Design Tokens (tailwind.config.js)

    theme: {
        extend: {
            colors: {
                primary: "#5D3FD3",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "accent-purple": "#5D3FD3",
                "accent-purple-light": "#F3F0FF",
                "accent-purple-soft": "#EBE5FF",
                "accent-purple-hover": "#4b32b0",
            },
        },
    },

## Dark Mode

- Use useColorScheme() from @/hooks/use-color-scheme.
- Use dark: Tailwind variants for component-level dark styles.
- Use Colors from @/constants/theme for navigation theming.

## Gotchas

- Box shadows are NOT supported via className on native; use StyleSheet.
- Arbitrary values like rounded-[12px] work in NativeWind v4.
- Import global.css only in the root _layout.tsx, not in components.
- nativewind-env.d.ts must exist for TypeScript to accept className.

## Anti-Patterns

    <View style={{ flexDirection: "row", padding: 16 }} /> // Wrong: use className
    <View className="shadow-md" />  // Wrong on native, use StyleSheet instead
    <Text style={{ color: "#5D3FD3" }} /> // Wrong: use className="text-primary"
