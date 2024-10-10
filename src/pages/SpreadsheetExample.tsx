import React from "react";

const TestPage: React.FC = () => {
  // Generate dummy data
  const rows = 20;
  const cols = 10;
  const data = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from(
      { length: cols },
      (_, colIndex) => rowIndex * cols + colIndex + 1
    )
  );

  // Calculate the minimum width based on the number of columns
  const minWidth = (cols + 1) * 80; // 80px per cell (w-20 = 5rem = 80px)

  return (
    <div
      className="w-full h-screen overflow-auto"
      data-testid="double-scroll-grid-container"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px` }}
        data-testid="grid-content"
      >
        {/* Sticky column headers */}
        <div
          className="sticky top-0 z-10 bg-gray-200"
          data-testid="column-header-container"
        >
          <div className="flex">
            {/* Top-left corner cell */}
            <div
              className="sticky left-0 z-30 w-20 h-10 flex items-center justify-center font-bold border border-gray-300 bg-gray-300"
              data-testid="top-left-corner"
            ></div>
            {Array.from({ length: cols }, (_, index) => (
              <div
                key={index}
                className="w-20 h-10 flex items-center justify-center font-bold border border-gray-300"
                data-testid={`column-header-${index}`}
              >
                {String.fromCharCode(65 + index)}
              </div>
            ))}
          </div>
        </div>

        {/* Table body */}
        <div className="relative" data-testid="grid-body">
          {data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              data-testid={`row-${rowIndex}`}
            >
              {/* Sticky row headers */}
              <div
                className="sticky left-0 z-20 w-20 h-10 flex items-center justify-center font-bold bg-gray-200 border border-gray-300"
                data-testid={`row-header-${rowIndex}`}
              >
                {rowIndex + 1}
              </div>
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className="w-20 h-10 flex items-center justify-center border border-gray-300"
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Spacer to hide scrolling content */}
      <div
        className="fixed top-0 left-0 w-20 h-10 bg-gray-300 z-40"
        data-testid="scroll-spacer"
      ></div>
    </div>
  );
};

export default TestPage;
