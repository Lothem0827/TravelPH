import React from "react";
import { View } from "react-native";
import ExploreIcon from "@/assets/icons/explore-icon.svg";
import AppText from "@/components/AppText";

interface VisitedBadgeProps {
    visitedCount: number;
}

const VisitedBadge: React.FC<VisitedBadgeProps> = ({ visitedCount }) => {
    return (
        <View className="absolute bottom-5 left-5 right-5 z-40 bg-yellow-50 rounded-2xl p-3.5 flex-row items-center gap-1.5 shadow-sm border border-yellow-100">
            <ExploreIcon width={20} height={20} />
            <AppText variant="Body" className="text-yellow-600 font-medium flex-1">
                {visitedCount > 0 ? (
                    <>You’ve been to <AppText variant="BodyBold" className="text-yellow-600">{visitedCount} provinces</AppText> in the Philippines.</>
                ) : (
                    "Search or tap a province to start diary"
                )}
            </AppText>
        </View>
    );
};

export default VisitedBadge;
