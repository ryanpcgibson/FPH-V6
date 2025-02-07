import React from "react";

interface SvgPatternProps {
  patternId: string;
}

// Import SVG files from the patterns directory
const patterns: Record<string, string> = {};
const modules = import.meta.glob("@/assets/patterns/*.svg", {
  eager: true,
  import: "default", // Change to import the default export
});

// Process the modules to create the patterns dictionary
Object.entries(modules).forEach(([path, module]) => {
  const patternId = path.split("/").pop()?.replace(".svg", "");
  if (patternId) {
    patterns[patternId] = module as string;
  }
});

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
        backgroundImage: `url("${patternSrc}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
};

export default SvgPattern;
