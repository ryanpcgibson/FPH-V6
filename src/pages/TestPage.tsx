import React from "react";
import DoubleScrollGrid from "../components/DoubleScrollGrid";

const TestPage: React.FC = () => {
  const rows = 20;
  const cols = 21;

  const getData = (row: number, col: number) => row * cols + col + 1;

  const columnHeaders = Array.from({ length: cols }, (_, i) => 2003 + i);
  const rowHeaders = [
    "Fido",
    "Rex",
    "Buddy",
    "Max",
    "Charlie",
    "Rocky",
    "Tiger",
    "Jake",
    "Lucky",
    "Bella",
  ];

  return (
    <DoubleScrollGrid
      rows={rows}
      cols={cols}
      getData={getData}
      columnHeaders={columnHeaders}
      rowHeaders={rowHeaders}
    />
  );
};

export default TestPage;
