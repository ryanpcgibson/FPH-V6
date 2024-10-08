import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import SvgPattern from "@/components/SvgPattern"; // Add this import

const minCellWidth = 80;
const maxCellWidth = 320;
const minCellHeight = 30;
const maxCellHeight = 120;
const maxRows = 5;

// Sub-components
const ColumnHeaders: React.FC<{
  headers: React.ReactNode[];
  gridTitle: React.ReactNode;
  cellWidth: number;
  cellHeight: number;
  headerWidth: number;
}> = ({ headers, gridTitle, headerWidth, cellWidth, cellHeight }) => {
  return (
    <div className="relative">
      <div
        className="flex"
        style={{ height: `${cellHeight}px` }}
        data-testid="column-headers"
      >
        {headers.map((header, index) => (
          <div
            key={index}
            className="flex items-center justify-center header-box flex-shrink-0"
            style={{ width: `${cellWidth}px` }}
            data-testid={`column-header-${index}`}
          >
            {header}
          </div>
        ))}
      </div>
      <div
        className="absolute top-0 right-0 z-40 flex items-center justify-center align-middle header-box"
        style={{ width: `${headerWidth}px`, height: `${cellHeight}px` }}
        data-testid="top-right-corner"
      >
        {gridTitle}
      </div>
    </div>
  );
};

const RowHeader: React.FC<{
  header: React.ReactNode;
  cellWidth: number;
  rowIndex: number;
}> = ({ header, cellWidth, rowIndex }) => (
  <div
    className="sticky z-30 right-0 flex items-center justify-center header-box border-l-8"
    style={{ width: `${cellWidth}px` }}
    data-testid={`row-header-${rowIndex}`}
  >
    {header}
  </div>
);

// TODO this should just be calling TimelineCell
const Cell: React.FC<{
  content: React.ReactNode;
  cellWidth: number;
  rowIndex: number;
  colIndex: number;
}> = ({ content, cellWidth, rowIndex, colIndex }) => (
  <div
    className="flex items-center justify-center border-t border-b border-white z-30 w-full"
    style={{ width: `${cellWidth}px` }}
    data-testid={`cell-${rowIndex}-${colIndex}`}
  >
    {content}
  </div>
);

interface RowProps {
  rowIndex: number;
  cols: number;
  rowWidth: number;
  cellWidth: number;
  cellHeight: number;
  // cellStyle: React.CSSProperties;
  getCellContents: (row: number, col: number) => React.ReactNode;
  rowHeader: React.ReactNode;
  patternId: string;
}

// TODO move pattern into row, calculate width to avoid pattern break
const Row: React.FC<RowProps> = ({
  rowIndex,
  cols,
  rowWidth,
  cellHeight,
  cellWidth,
  getCellContents,
  rowHeader,
  patternId,
}) => {
  return (
    <div
      className="relative flex mb-1"
      style={{ height: `${cellHeight}px` }}
      data-testid={`row-${rowIndex}`}
    >
      <div className="absolute inset-0 z-20 w-full">
        <SvgPattern patternId={patternId} />
      </div>
      {Array.from({ length: cols }, (_, colIndex) => (
        <Cell
          key={colIndex}
          content={getCellContents(rowIndex, colIndex)}
          cellWidth={cellWidth}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      ))}
      <RowHeader header={rowHeader} cellWidth={cellWidth} rowIndex={rowIndex} />
    </div>
  );
};

interface DoubleScrollGridProps {
  getCellContents: (row: number, col: number) => React.ReactNode;
  gridTitle: React.ReactNode;
  columnHeaders: React.ReactNode[];
  rowHeaders: React.ReactNode[];
  patternIds: string[];
}
const DoubleScrollGrid: React.FC<DoubleScrollGridProps> = ({
  getCellContents,
  gridTitle,
  columnHeaders,
  rowHeaders,
  patternIds,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const cols = columnHeaders.length;
  const rows = rowHeaders.length;
  const [cellHeight, setCellHeight] = useState(minCellHeight);
  const [cellWidth, setCellWidth] = useState(minCellWidth);
  const [rowWidth, setRowWidth] = useState(minCellHeight * cols);
  const [headerWidth, setHeaderWidth] = useState(minCellWidth * 2);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateCellDimensions = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const containerWidth = containerRef.current.clientWidth;
        console.log("container", containerWidth, "x", containerHeight);
        const newCellHeight = Math.min(
          Math.max(Math.floor(containerHeight / (maxRows + 2)), minCellHeight),
          maxCellHeight
        );
        const newCellWidth = Math.min(
          Math.max(
            Math.floor((newCellHeight / minCellHeight) * minCellWidth),
            minCellWidth
          ),
          maxCellWidth
        );
        console.log(
          `h: ${newCellHeight} = ${containerHeight} / ${
            maxRows + 2
          } [${minCellHeight}/${maxCellHeight}]`
        );
        console.log(
          `w: ${newCellWidth} = ${newCellHeight} / ${minCellHeight} * ${minCellWidth} [${minCellWidth}/${maxCellWidth}]`
        );

        if (newCellHeight !== cellHeight) {
          setCellHeight(newCellHeight);
        }
        if (newCellWidth !== cellWidth) {
          setCellWidth(newCellWidth);
        }

        // console.log("Updated dimensions:", { newCellWidth, newCellHeight });
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
    setHeaderWidth(cellWidth * 2);
    console.log("cellWidth", cellWidth, "headerWidth", cellWidth * 2);
  }, [cellWidth, cellHeight]);

  useEffect(() => {
    if (columnHeaders.length > 0) {
      setRowWidth(cellWidth * columnHeaders.length);
    }
  }, [columnHeaders, cellWidth]);

  return (
    <div
      ref={containerRef}
      data-testid="double-scroll-grid-container"
      className="h-screen overflow-auto"
      style={{ width: `${rowWidth}px` }}
    >
      <div
        className="relative"
        data-testid="grid-content"
        style={{ width: `${rowWidth}px` }}
      >
        <div
          className="sticky z-40 top-0 mb-1"
          data-testid="column-header-container"
        >
          <ColumnHeaders
            headers={columnHeaders}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            headerWidth={headerWidth}
            gridTitle={gridTitle}
          />
        </div>
        <div className="relative z-10" data-testid="grid-body">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Row
              key={rowIndex}
              rowIndex={rowIndex}
              cols={cols}
              rowWidth={rowWidth}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              getCellContents={getCellContents}
              rowHeader={rowHeaders[rowIndex]}
              patternId={patternIds[rowIndex % patternIds.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoubleScrollGrid;
