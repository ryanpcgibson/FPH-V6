import React from "react";

interface SvgPatternProps {
  patternId: string;
}

// Import SVG files from the patterns directory
const patterns: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob("@/assets/patterns/*.svg", {
      eager: true,
      as: "url",
    })
  ).map(([path, url]) => [
    path.split("/").pop()?.replace(".svg", ""),
    url as string,
  ])
);

const SvgPattern: React.FC<SvgPatternProps> = ({ patternId }) => {
  const patternSrc = patterns[patternId];

  if (!patternSrc) {
    console.warn(`Pattern with id "${patternId}" not found.`);
    return null;
  }

  return (
    <div
      className="inset-0 bg-gray-100 w-full h-full"
      style={{
        backgroundImage: `url(${patternSrc})`,
        backgroundRepeat: "repeat",
      }}
    />
  );
};

export default SvgPattern;
