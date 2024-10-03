import React from "react";

interface DoubleScrollGridProps {
  rows: number;
  cols: number;
  cellWidth?: number;
  cellHeight?: number;
  getData: (row: number, col: number) => React.ReactNode;
  columnHeaders: React.ReactNode[];
  rowHeaders: React.ReactNode[];
}

const DoubleScrollGrid: React.FC<DoubleScrollGridProps> = ({
  rows,
  cols,
  cellWidth = 80,
  cellHeight = 40,
  getData,
  columnHeaders,
  rowHeaders,
}) => {
  const minWidth = (cols + 1) * cellWidth;
  const cellClass = `w-[${cellWidth}px] h-[${cellHeight}px] flex items-center justify-center border border-gray-300`;

  return (
    <div className="w-full h-screen overflow-auto">
      <div className="relative" style={{ minWidth: `${minWidth}px` }}>
        {/* Sticky column headers */}
        <div className="sticky top-0 z-10 bg-gray-200">
          <div className="flex">
            {columnHeaders.map((header, index) => (
              <div key={index} className={`${cellClass} font-bold`}>
                {header}
              </div>
            ))}
            {/* Top-right corner cell */}
            <div
              className={`sticky right-0 z-30 ${cellClass} font-bold bg-gray-300`}
            ></div>
          </div>
        </div>

        {/* Grid body */}
        <div className="relative">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({ length: cols }, (_, colIndex) => (
                <div key={colIndex} className={cellClass}>
                  {getData(rowIndex, colIndex)}
                </div>
              ))}
              {/* Sticky row headers */}
              <div
                className={`sticky right-0 z-20 ${cellClass} font-bold bg-gray-200`}
              >
                {rowHeaders[rowIndex]}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Spacer to hide scrolling content */}
      <div className="fixed top-0 right-0 bg-gray-300 z-40 w-[${cellWidth}px] h-[${cellHeight}px]"></div>
    </div>
  );
};

export default DoubleScrollGrid;
