import React from "react";

interface DoubleScrollGridProps {
  cellWidth?: number;
  cellHeight?: number;
  getData: (row: number, col: number) => React.ReactNode;
  columnHeaders: React.ReactNode[];
  rowHeaders: React.ReactNode[];
}

const DoubleScrollGrid: React.FC<DoubleScrollGridProps> = ({
  cellWidth = 80,
  cellHeight = 30,
  getData,
  columnHeaders,
  rowHeaders,
}) => {
  const cols = columnHeaders.length;
  const rows = rowHeaders.length;
  const fullWidth = cols * cellWidth;
  const cellStyle = {
    minWidth: `${cellWidth}px`,
    width: `${cellWidth}px`,
    minHeight: `${cellHeight}px`,
    height: `${cellHeight}px`,
  };

  console.log(getData);
  return (
    <div
      className="w-full h-screen overflow-auto"
      data-testid="double-scroll-grid-container"
    >
      <div className="relative" data-testid="grid-content">
        <div
          className="sticky z-10 top-0 bg-white"
          style={{ width: `${fullWidth}px` }}
          data-testid="column-header-container"
        >
          <div className="flex">
            {columnHeaders.map((header, index) => (
              <div
                key={index}
                className="flex items-center justify-center border border-white font-bold"
                style={cellStyle}
                data-testid={`column-header-${index}`}
              >
                {header}
              </div>
            ))}
            <div
              className="sticky z-30 right-0 flex border border-white bg-white"
              style={cellStyle}
              data-testid="top-right-corner"
            ></div>
          </div>
        </div>

        <div className="relative" data-testid="grid-body">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              data-testid={`row-${rowIndex}`}
            >
              {Array.from({ length: cols }, (_, colIndex) => (
                <div
                  key={colIndex}
                  className="flex items-center justify-center border border-white"
                  style={cellStyle}
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                >
                  {getData(rowIndex, colIndex)}
                </div>
              ))}
              <div
                className="sticky z-20 right-0 flex items-center justify-center font-bold border border-white bg-gray-200"
                style={cellStyle}
                data-testid={`row-header-${rowIndex}`}
              >
                {rowHeaders[rowIndex]}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="fixed  z-40 top-0 right-0 border-white bg-white"
        style={{ width: `${cellWidth}px`, height: `${cellHeight}px` }}
        data-testid="scroll-spacer"
      ></div>
    </div>
  );
};

export default DoubleScrollGrid;
