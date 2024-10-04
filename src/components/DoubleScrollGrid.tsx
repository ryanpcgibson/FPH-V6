import React from "react";

interface DoubleScrollGridProps {
  cellStyle: React.CSSProperties;
  fullWidth: number;
  getData: (row: number, col: number) => React.ReactNode;
  columnHeaders: React.ReactNode[];
  rowHeaders: React.ReactNode[];
}

// Sub-components
const ColumnHeaders: React.FC<{
  headers: React.ReactNode[];
  cellStyle: React.CSSProperties;
  fullWidth: number;
}> = ({ headers, cellStyle, fullWidth }) => (
  <div
    className="sticky z-10 top-0 bg-white"
    style={{ width: `${fullWidth}px` }}
    data-testid="column-header-container"
  >
    <div className="flex">
      {headers.map((header, index) => (
        <div
          key={index}
          className="flex items-center justify-center border-t border-b border-white font-bold"
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

const Row: React.FC<{
  rowIndex: number;
  cols: number;
  cellStyle: React.CSSProperties;
  getData: (row: number, col: number) => React.ReactNode;
  rowHeader: React.ReactNode;
}> = ({ rowIndex, cols, cellStyle, getData, rowHeader }) => (
  <div
    className="flex"
    data-testid={`row-${rowIndex}`}
  >
    {Array.from({ length: cols }, (_, colIndex) => (
      <Cell
        key={colIndex}
        content={getData(rowIndex, colIndex)}
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

const DoubleScrollGrid: React.FC<DoubleScrollGridProps> = ({
  cellStyle,
  fullWidth,
  getData,
  columnHeaders,
  rowHeaders,
}) => {
  const cols = columnHeaders.length;
  const rows = rowHeaders.length;

  return (
    <div data-testid="double-scroll-grid-container">
      <div className="relative" data-testid="grid-content">
        <ColumnHeaders
          headers={columnHeaders}
          cellStyle={cellStyle}
          fullWidth={fullWidth}
        />

        <div className="relative" data-testid="grid-body">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <Row
              key={rowIndex}
              rowIndex={rowIndex}
              cols={cols}
              cellStyle={cellStyle}
              getData={getData}
              rowHeader={rowHeaders[rowIndex]}
            />
          ))}
        </div>
      </div>
      <div
        className="fixed z-40 top-0 right-0 border-white bg-white"
        style={{ ...cellStyle }}
        data-testid="scroll-spacer"
      ></div>
    </div>
  );
};

export default DoubleScrollGrid;
