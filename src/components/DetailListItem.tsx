import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  LinkBreak1Icon,
} from "@radix-ui/react-icons";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface TimelineListItemProps {
  startDate: Date;
  endDate?: Date | undefined;
  children: React.ReactNode;
  dropdownItems: DropdownItem[];
}

// Helper functions to create dropdown items without hooks
export const createEditItem = (
  path: string,
  onClick: () => void
): DropdownItem => ({
  icon: <Pencil1Icon className="mr-2" />,
  label: "Edit",
  onClick,
});

export const createDisconnectItem = (onClick: () => void): DropdownItem => ({
  icon: <LinkBreak1Icon className="mr-2" />,
  label: "Disconnect",
  onClick,
  className: "text-destructive focus:text-destructive",
});

const TimelineListItem: React.FC<TimelineListItemProps> = ({
  startDate,
  endDate,
  children,
  dropdownItems,
}) => {
  const startYear = format(new Date(String(startDate)), "yyyy");
  const endYear = endDate ? format(new Date(String(endDate)), "yyyy") : null;

  const dateDisplay =
    endYear && endYear !== startYear
      ? `'${startYear.slice(-2)} - '${endYear.slice(-2)}`
      : startYear;

  return (
    <div className="grid grid-cols-[1fr_40px_80px] gap-2 items-center py-2 px-1 hover:bg-accent/5">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <DotsHorizontalIcon className="cursor-pointer hover:opacity-70 text-primary-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background">
          {dropdownItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              className={item.className}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="h-[30px] w-[80px] box-border flex items-center justify-center font-bold rounded-lg bg-foreground text-background">
        {dateDisplay}
      </div>
    </div>
  );
};

export default TimelineListItem;
