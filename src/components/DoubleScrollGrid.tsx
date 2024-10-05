import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const minCellWidth = 80;
const maxCellWidth = 320;
const minCellHeight = 30;
const maxCellHeight = 120;
const maxRows = 5;

// Sub-components
const ColumnHeaders: React.FC<{
  headers: React.ReactNode[];
  cellStyle: React.CSSProperties;
  fullWidth: number;
}> = ({ headers, cellStyle, fullWidth }) => (
  <div
    className="sticky z-20 top-0 bg-white"
    // style={{ width: `${fullWidth}px` }}
    data-testid="column-header-container"
  >
    <div className="flex">
      {headers.map((header, index) => (
        <div
          key={index}
          className="flex items-center justify-center font-bold"
          style={cellStyle}
          data-testid={`column-header-${index}`}
        >
          {header}
        </div>
      ))}
      <div
        className="sticky z-30 right-0 flex border-t border-b border-white bg-white"
        style={cellStyle}
        data-testid="top-right-corner"
      ></div>
    </div>
  </div>
);

const RowHeader: React.FC<{
  header: React.ReactNode;
  cellStyle: React.CSSProperties;
  rowIndex: number;
}> = ({ header, cellStyle, rowIndex }) => (
  <div
    className="sticky z-20 right-0 flex items-center justify-center font-bold border-t border-b border-white bg-gray-200"
    style={cellStyle}
    data-testid={`row-header-${rowIndex}`}
  >
    {header}
  </div>
);

const Cell: React.FC<{
  content: React.ReactNode;
  cellStyle: React.CSSProperties;
  rowIndex: number;
  colIndex: number;
}> = ({ content, cellStyle, rowIndex, colIndex }) => (
  <div
    className="flex items-center justify-center border-t border-b border-white"
    style={cellStyle}
    data-testid={`cell-${rowIndex}-${colIndex}`}
  >
    {content}
  </div>
);

interface RowProps {
  rowIndex: number;
  cols: number;
  cellStyle: React.CSSProperties;
  getCellContents: (
    row: number,
    col: number,
    cellStyle: React.CSSProperties
  ) => React.ReactNode;
  rowHeader: React.ReactNode;
}

// TODO move pattern into row, calculate width to avoid pattern break
const Row: React.FC<RowProps> = ({
  rowIndex,
  cols,
  cellStyle,
  getCellContents,
  rowHeader,
}) => {
  return (
    <div className="flex mb-1" data-testid={`row-${rowIndex}`}>
      {Array.from({ length: cols }, (_, colIndex) => (
        <Cell
          key={colIndex}
          content={getCellContents(rowIndex, colIndex, cellStyle)}
          cellStyle={cellStyle}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      ))}
      <RowHeader 
        header={rowHeader} 
        cellStyle={cellStyle} 
        rowIndex={rowIndex} 
      />
    </div>
  );
};

interface DoubleScrollGridProps {
  getCellContents: (
    row: number,
    col: number,
    cellStyle: React.CSSProperties
  ) => React.ReactNode;
  columnHeaders: React.ReactNode[];
  rowHeaders: React.ReactNode[];
}
const DoubleScrollGrid: React.FC<DoubleScrollGridProps> = ({
  getCellContents,
  columnHeaders,
  rowHeaders,
}) => {
  const containerRef = useRef(null);

  const [cellStyle, setCellStyle] = useState({
    minWidth: `${minCellWidth}px`,
    width: `${minCellWidth}px`,
    maxWidth: `${maxCellWidth}px`,
    minHeight: `${minCellHeight}px`,
    height: `${minCellHeight}px`,
    maxHeight: `${maxCellHeight}px`,
  });

  const cols = columnHeaders.length;
  const rows = rowHeaders.length;
  const [cellHeight, setCellHeight] = useState(minCellHeight);
  const [cellWidth, setCellWidth] = useState(minCellWidth);
  const [fullWidth, setFullWidth] = useState(minCellHeight);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateCellDimensions = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const cellHeight = Math.min(
          Math.max(Math.floor(containerHeight / (maxRows + 1)), minCellHeight),
          maxCellHeight
        );
        const cellWidth = Math.min(
          Math.max(
            Math.floor((cellHeight / minCellHeight) * minCellWidth),
            minCellWidth
          ),
          maxCellWidth
        );
        setCellHeight(cellHeight);
        setCellWidth(cellWidth);
      }
    };

    updateCellDimensions();

    const resizeObserver = new ResizeObserver(updateCellDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("cellHeight", cellHeight, "cellWidth", cellWidth);
    setCellStyle({
      ...cellStyle,
      height: `${cellHeight}px`,
      width: `${cellWidth}px`,
    });

    if (columnHeaders.length > 0) {
      setFullWidth(cellWidth * columnHeaders.length);
    }
  }, [columnHeaders, cellWidth, cellHeight]);

  useEffect(() => {
    console.log("fullWidth", fullWidth);
  }, [fullWidth]);
  return (
    <div
      ref={containerRef}
      data-testid="double-scroll-grid-container"
      className="h-screen w-screen"
    >
      <div className="relative" data-testid="grid-content">
        <ColumnHeaders
          headers={columnHeaders}
          cellStyle={cellStyle}
          fullWidth={fullWidth}
        />

        <div className="relative z-10" data-testid="grid-body">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Row
              key={rowIndex}
              rowIndex={rowIndex}
              cols={cols}
              cellStyle={cellStyle}
              getCellContents={getCellContents}
              rowHeader={rowHeaders[rowIndex]}
            />
          ))}
        </div>
      </div>
      <div
        className="fixed z-40 top-0 right-0 border-white bg-white"
        // style={{ ...cellStyle }}
        data-testid="scroll-spacer"
      ></div>
    </div>
  );
};

export default DoubleScrollGrid;
