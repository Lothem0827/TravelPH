import React from "react";
import { Path } from "react-native-svg";

interface ProvincePathProps {
    id: string;
    d: string;
    fill: string;
    isSelected: boolean;
    onPress: (id: string) => void;
}

const ProvincePath: React.FC<ProvincePathProps> = React.memo(({ id, d, fill, isSelected, onPress }) => {
    return (
        <Path
            id={id}
            d={d}
            fill={fill}
            onPress={() => onPress(id)}
            stroke={isSelected ? "#EAB308" : "#fff"}
            strokeWidth={isSelected ? 1 : 0.26}
        />
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.fill === nextProps.fill &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.d === nextProps.d
    );
});

export default ProvincePath;
