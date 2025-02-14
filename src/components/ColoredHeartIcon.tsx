import React from "react";
import { Heart } from "lucide-react";

interface ColoredHeartIconProps {
  size?: number;
  fillColor?: string;
  outlineColor?: string;
  outerOutlineColor?: string;
}

const ColoredHeartIcon: React.FC<ColoredHeartIconProps> = ({
  size = 15,
  fillColor = "#000000",
  outlineColor = "#000000",
  outerOutlineColor = "#000000",
}) => {
  return (
    <Heart
      size={size}
      fill={fillColor}
      stroke={outlineColor}
      strokeWidth={1.5}
      className="transition-colors"
    />
  );
};

export default ColoredHeartIcon;
