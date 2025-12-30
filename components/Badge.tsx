import React from 'react';
import { Text, View, ViewProps } from 'react-native';

type BadgeVariant = 'primary' | 'secondary' | 'outline';

interface BadgeProps extends ViewProps {
    label: string;
    variant?: BadgeVariant;
    className?: string; // For overriding container styles if needed
    textClassName?: string; // For overriding text styles if needed
}

const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'primary',
    className = '',
    textClassName = '',
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-yellow-100 border-transparent';
            case 'secondary':
                return 'bg-slate-100 border-transparent';
            case 'outline':
                return 'bg-transparent border border-yellow-400';
            default:
                return 'bg-yellow-100 border-transparent';
        }
    };

    const getTextVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'text-yellow-700';
            case 'secondary':
                return 'text-slate-600';
            case 'outline':
                return 'text-yellow-700';
            default:
                return 'text-yellow-700';
        }
    };

    return (
        <View
            className={`self-start px-3 py-1.5 rounded-full border ${getVariantStyles()} ${className}`}
            {...props}
        >
            <Text
                className={`text-xs font-bold text-center ${getTextVariantStyles()} ${textClassName}`}
            >
                {label}
            </Text>
        </View>
    );
};

export default Badge;
