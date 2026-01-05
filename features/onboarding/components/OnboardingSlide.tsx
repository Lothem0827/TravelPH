
import React from 'react';
import { View, useWindowDimensions, Image, ViewStyle } from 'react-native';
import AppText from '@/components/AppText';

interface OnboardingSlideProps {
    title: string;
    subtitle: string;
    image?: any; // For now assuming local require or URI. Using 'any' for simplicity with requires.
    icon?: React.ReactNode;
}

export default function OnboardingSlide({ title, subtitle, image, icon }: OnboardingSlideProps) {
    const { width } = useWindowDimensions();

    return (
        <View style={{ width, paddingHorizontal: 20 }} className="flex-1 justify-center items-center">
            <View className="flex-1 justify-center items-center mb-10 w-full">
                {image && (
                    <Image
                        source={image}
                        style={{ width: width * 0.8, height: width * 0.8 }}
                        resizeMode="contain"
                        className="mb-8"
                    />
                )}
                {icon && (
                    <View className="mb-8">
                        {icon}
                    </View>
                )}

                <AppText className="text-3xl font-bold text-slate-800 text-center mb-4 leading-tight">
                    {title}
                </AppText>

                <AppText className="text-lg text-slate-500 text-center leading-relaxed px-4">
                    {subtitle}
                </AppText>
            </View>
        </View>
    );
}
