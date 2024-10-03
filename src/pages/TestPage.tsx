import React from "react";
import DoubleScrollGrid from "../components/DoubleScrollGrid";
import petTimelinesData from "@/db/dummy_petTimelines.json";

const TestPage: React.FC = () => {
  const petTimelines = petTimelinesData;
  const earliestYear = petTimelines.reduce(
    (min, pet) =>
      pet.segments.length > 0 ? Math.min(min, pet.segments[0].year) : min,
    Infinity
  );
  const latestYear = petTimelines.reduce(
    (max, pet) =>
      pet.segments.length > 0
        ? Math.max(max, pet.segments[pet.segments.length - 1].year)
        : max,
    -Infinity
  );
  const columnHeaders = Array.from(
    { length: latestYear - earliestYear + 1 },
    (_, i) => earliestYear + i
  );
  const rowHeaders = petTimelines.map((pet) => pet.petName);

  const getData = (row: number, col: number) => {
    const pet = petTimelines[row];
    const year = columnHeaders[col];
    const segment = pet.segments.find((s) => s.year === year);
    return segment ? segment.status : "";
  };

  // const columnHeaders = [
  //   2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
  //   2019, 2020, 2021, 2022, 2023, 2024,
  // ];

  // const rowHeaders = [
  //   "Fido",
  //   "Rex",
  //   "Buddy",
  //   "Max",
  //   "Charlie",
  //   "Rocky",
  //   "Tiger",
  //   "Jake",
  //   "Lucky",
  //   "Bella",
  // ];

  // const getData = (row: number, col: number) =>
  //   row * columnHeaders.length + col + 1;

  return (
    <DoubleScrollGrid
      getData={getData}
      columnHeaders={columnHeaders}
      rowHeaders={rowHeaders}
    />
  );
};

export default TestPage;
