import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  placeholder = "Pick a date",
  disabled = false,
  dateFormat = "PPP",
  minDate,
  maxDate,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(newDate: Date | undefined) => setDate(newDate)}
          initialFocus
          disabled={(currentDate) =>
            (minDate ? currentDate < minDate : false) ||
            (maxDate ? currentDate > maxDate : false)
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
