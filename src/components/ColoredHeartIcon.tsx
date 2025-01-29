import React from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";

interface ColoredHeartIconProps {
  size?: number;
  fillColor?: string;
  outlineColor?: string;
  outerOutlineColor?: string;
}

const ColoredHeartIcon: React.FC<ColoredHeartIconProps> = ({ size = 15 }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
    >
      <HeartIcon
        style={{
          color: "hsl(var(--background))",
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          transform: "scale(1.2)", // Slightly larger for outer outline
        }}
      />
      <HeartIcon
        style={{
          color: "hsl(var(--foreground))",
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          transform: "scale(1.1)", // Slightly larger for black outline
        }}
      />
      <HeartFilledIcon
        style={{
          color: "hsl(var(--primary))",
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default ColoredHeartIcon;
