import React from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";

interface ColoredHeartIconProps {
  size?: number;
  fillColor?: string;
  outlineColor?: string;
}

const ColoredHeartIcon: React.FC<ColoredHeartIconProps> = ({
  size = 15, // same default as other radix icons
  fillColor = "#ff0000", // Default red fill
  outlineColor = "black", // Default black outline
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
    >
      <HeartFilledIcon
        style={{
          color: fillColor,
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
        }}
      />
      <HeartIcon
        style={{
          color: outlineColor,
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
