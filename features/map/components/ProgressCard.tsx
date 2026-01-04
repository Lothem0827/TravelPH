import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from "react-native-reanimated";
import AppText from "@/components/AppText";

// Animated Circle for Reanimated
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCardProps {
    percentage: number; // 0 to 100
    rankTitle?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ percentage, rankTitle = "Curious Traveler" }) => {
    const radius = 18;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(percentage / 100, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - progress.value * circumference;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View className="bg-[#FFFBEB] flex-row items-center justify-between p-4 rounded-3xl mx-4 mb-4 shadow-sm border border-[#FEF3C7]">
            {/* Left Icon */}
            <View className="items-center justify-center">
                <View className="w-12 h-12 bg-[#EAB308] rounded-full items-center justify-center shadow-sm">
                    {/* Placeholder for Compass Icon if not available, or use a generic one */}
                    <AppText variant="Heading" className="text-white text-xl">🧭</AppText>
                </View>
            </View>

            {/* Center Text */}
            <View className="flex-1 px-4">
                <AppText variant="BodyBold" className="text-[#92400E] text-lg">
                    {rankTitle}
                </AppText>
                <AppText variant="Body" className="text-[#92400E] text-sm opacity-80">
                    You explored {Math.round(percentage)}% of Philippines.
                </AppText>
            </View>

            {/* Right Donut Chart */}
            <View className="items-center justify-center">
                <View className="relative w-14 h-14 items-center justify-center">
                    <Svg
                        width={halfCircle * 2}
                        height={halfCircle * 2}
                        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
                    >
                        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                            {/* Background Circle */}
                            <Circle
                                cx="50%"
                                cy="50%"
                                r={radius}
                                stroke="#FEF3C7" // Lighter yellow/cream
                                strokeWidth={strokeWidth}
                                fill="transparent"
                            />
                            {/* Progress Circle */}
                            <AnimatedCircle
                                cx="50%"
                                cy="50%"
                                r={radius}
                                stroke="#EAB308" // Primary Yellow
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                animatedProps={animatedProps}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        </G>
                    </Svg>
                    {/* Percentage Text Overlay */}
                    <View className="absolute inset-0 items-center justify-center">
                        <AppText variant="Caption" className="text-[#92400E] text-[10px] font-semibold">
                            {Math.round(percentage)}%
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProgressCard;
