// import { useMemo } from "react";
// import type { TimelineSection } from "@/types/timeline";

// export const useTimelineCalculations = (sections: TimelineSection[]) => {
//   return useMemo(() => {
//     // Flatten all items from all sections
//     const allItems = sections.flatMap((section) => section.items);

//     const earliestYear = allItems.reduce(
//       (min, item) =>
//         item.segments.length > 0 ? Math.min(min, item.segments[0].year) : min,
//       Infinity
//     );

//     const latestYear = allItems.reduce(
//       (max, item) =>
//         item.segments.length > 0
//           ? Math.max(max, item.segments[item.segments.length - 1].year)
//           : max,
//       -Infinity
//     );

//     const columnHeaders = Array.from(
//       { length: latestYear - earliestYear + 1 },
//       (_, i) => earliestYear + i
//     );

//     const minWidth = (columnHeaders.length + 1) * 80;

//     return {
//       columnHeaders,
//       minWidth,
//     };
//   }, [sections]);
// };
