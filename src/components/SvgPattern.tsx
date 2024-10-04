import React from "react";

interface SvgPatternProps {
  patternId: string;
  width?: number;
  height?: number;
  className?: string;  // Add this line
}

// Use import.meta.glob to import all SVG files from the patterns directory
const patternModules = import.meta.glob("@/assets/patterns/*.svg", {
  eager: true,
});

// Create a dictionary of all patterns
const patterns: { [key: string]: string } = {};
Object.entries(patternModules).forEach(([path, module]) => {
  const patternId = path.split("/").pop()?.replace(".svg", "");
  if (patternId) {
    patterns[patternId] = (module as { default: string }).default;
  }
});

const SvgPattern: React.FC<SvgPatternProps> = ({
  patternId,
  width = 100,
  height = 100,
  className = "",  // Add this line
}) => {
  const patternSrc = patterns[patternId];

  if (!patternSrc) {
    console.warn(`Pattern with id "${patternId}" not found.`);
    return null;
  }

  return (
    <div
      className={className}  // Add this line
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${patternSrc})`,
        // backgroundSize: "8px 8px", // Adjust this value to change the size of each tile
        backgroundRepeat: "repeat",

      }}
    />
  );
};

export default SvgPattern;
