import React from "react";
import DoubleScrollGrid from "../components/DoubleScrollGrid";

const TestPage: React.FC = () => {
  const columnHeaders = [
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
    2019, 2020, 2021, 2022, 2023, 2024,
  ];

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

  const getData = (row: number, col: number) =>
    row * columnHeaders.length + col + 1;

  return (
    <DoubleScrollGrid
      getData={getData}
      columnHeaders={columnHeaders}
      rowHeaders={rowHeaders}
    />
  );
};

export default TestPage;
