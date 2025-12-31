import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import AppText from '@/components/AppText';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    className?: string; // For overriding container styles if needed
    textClassName?: string; // For overriding text styles if needed
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    className = '',
    textClassName = '',
    icon,
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-yellow-400 active:bg-yellow-500 border-transparent';
            case 'secondary':
                return 'bg-yellow-100 active:bg-yellow-200 border-transparent';
            case 'outline':
                return 'bg-white active:bg-yellow-50 border border-yellow-300';
            default:
                return 'bg-yellow-400 active:bg-yellow-500 border-transparent';
        }
    };



    return (
        <TouchableOpacity
            className={`w-full py-3.5 px-4 rounded-full flex-row items-center justify-center border ${getVariantStyles()} ${className}`}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <AppText
                variant="ButtonText"
                className={`text-center ${textClassName}`}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {title}
            </AppText>
        </TouchableOpacity>
    );
};

export default Button;
