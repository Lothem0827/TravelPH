import React from 'react';
import { Text, TextProps } from 'react-native';
import { TYPOGRAPHY } from '@/styles/theme';

const VARIANTS = { ...TYPOGRAPHY };
type TypographyVariant = keyof typeof VARIANTS;

interface AppTextProps extends TextProps {
    variant?: TypographyVariant;
    children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({
    variant = "Body",
    style,
    className,
    children,
    ...props
}) => {
    // Combine the predefined variant style with any optional className overrides
    // Note: className overrides will take precedence in Tailwind logic usually if placed after,
    // but here we just append the string.
    const variantClass = VARIANTS[variant];

    return (
        <Text
            className={`${variantClass} ${className || ''}`}
            style={style}
            {...props}
        >
            {children}
        </Text>
    );
};

export default AppText;
