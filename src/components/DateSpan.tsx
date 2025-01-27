import { format } from "date-fns";

const DateSpan: React.FC<{
  start_date: Date | undefined;
  end_date: Date | string | undefined;
}> = ({ start_date, end_date }) => {
  return (
    <div className="flex gap-2">
      <div>{start_date && format(start_date, "MM/dd/yyyy")}</div>
      {end_date && end_date instanceof Date && (
        <div>&mdash; {format(end_date, "MMM d, yyyy")}</div>
      )}
      {end_date && typeof end_date === "string" && (
        <div>&mdash; {end_date}</div>
      )}
    </div>
  );
};

export default DateSpan;
