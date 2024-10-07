import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import SvgPattern from "@/components/SvgPattern"; // Add this import

const minCellWidth = 80;
const maxCellWidth = 320;
const minCellHeight = 30;
const maxCellHeight = 120;
const maxRows = 5;

const borderClass = "border box-border border-white";

// Sub-components
const ColumnHeaders: React.FC<{
  headers: React.ReactNode[];
  cellStyle: React.CSSProperties;
  fullWidth: number;
}> = ({ headers, cellStyle, fullWidth }) => (
  <div
    className="sticky z-20 top-0 bg-white"
    data-testid="column-header-container"
  >
    <div className="flex">
      {headers.map((header, index) => (
        <div
          key={index}
          className="flex items-center justify-center header-box "
          style={cellStyle}
          data-testid={`column-header-${index}`}
        >
          {header}
        </div>
      ))}
      <div
        className="sticky z-30 right-0 flex header-box"
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
    className="sticky z-30 right-0 flex items-center justify-center header-box"
    style={cellStyle}
    data-testid={`row-header-${rowIndex}`}
  >
    {header}
  </div>
);

// TODO this should just be calling TimelineCell
const Cell: React.FC<{
  content: React.ReactNode;
  cellStyle: React.CSSProperties;
  rowIndex: number;
  colIndex: number;
}> = ({ content, cellStyle, rowIndex, colIndex }) => (
  <div
    className="flex items-center justify-center border-t border-b border-white z-30"
    style={cellStyle}
    data-testid={`cell-${rowIndex}-${colIndex}`}
  >
    {content}
  </div>
);

interface RowProps {
  rowIndex: number;
  cols: number;
  rowWidth: number;
  rowHeight: number;
  cellStyle: React.CSSProperties;
  getCellContents: (
    row: number,
    col: number,
    cellStyle: React.CSSProperties
  ) => React.ReactNode;
  rowHeader: React.ReactNode;
  patternId: string;
}

// TODO move pattern into row, calculate width to avoid pattern break
const Row: React.FC<RowProps> = ({
  rowIndex,
  cols,
  rowWidth,
  rowHeight,
  cellStyle,
  getCellContents,
  rowHeader,
  patternId,
}) => {
  return (
    <div
      className={`relative flex mb-1 w-[${rowWidth}px]`}
      data-testid={`row-${rowIndex}`}
    >
      <div className="absolute inset-0 z-20 w-full">
        <SvgPattern
          patternId={patternId}
          rowHeight={rowHeight}
          rowWidth={rowWidth}
        />
      </div>
      {Array.from({ length: cols }, (_, colIndex) => (
        <Cell
          key={colIndex}
          content={getCellContents(rowIndex, colIndex, cellStyle)}
          cellStyle={cellStyle}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      ))}
      <RowHeader header={rowHeader} cellStyle={cellStyle} rowIndex={rowIndex} />
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
  patternIds: string[];
}
const DoubleScrollGrid: React.FC<DoubleScrollGridProps> = ({
  getCellContents,
  columnHeaders,
  rowHeaders,
  patternIds,
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
  const [rowWidth, setRowWidth] = useState(minCellHeight * cols);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateCellDimensions = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const containerWidth = containerRef.current.clientWidth;
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
    setCellStyle({
      ...cellStyle,
      height: `${cellHeight}px`,
      width: `${cellWidth}px`,
    });
  }, [cellWidth, cellHeight]);

  useEffect(() => {
    if (columnHeaders.length > 0) {
      setRowWidth(cellWidth * (columnHeaders.length + 1));
    }
  }, [columnHeaders, cellWidth]);

  return (
    <div
      ref={containerRef}
      data-testid="double-scroll-grid-container"
      className="h-screen w-full overflow-auto"
    >
      <div className="relative" data-testid="grid-content">
        <ColumnHeaders
          headers={columnHeaders}
          cellStyle={cellStyle}
          fullWidth={rowWidth}
        />

        <div className="relative z-10" data-testid="grid-body">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Row
              key={rowIndex}
              rowIndex={rowIndex}
              cols={cols}
              rowWidth={rowWidth}
              rowHeight={cellHeight}
              cellStyle={cellStyle}
              getCellContents={getCellContents}
              rowHeader={rowHeaders[rowIndex]}
              patternId={patternIds[rowIndex % patternIds.length]}
            />
          ))}
        </div>
      </div>
      <div
        className="fixed z-40 top-0 right-0 border-white bg-white"
        data-testid="scroll-spacer"
      ></div>
    </div>
  );
};

export default DoubleScrollGrid;
