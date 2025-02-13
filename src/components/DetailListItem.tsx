import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Unlink } from "lucide-react";

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface DetailListItemProps {
  dateDisplay: string;
  children: React.ReactNode;
  dropdownItems: DropdownItem[];
}

// Helper functions to create dropdown items without hooks
export const createEditItem = (
  path: string,
  onClick: () => void
): DropdownItem => ({
  icon: <Pencil className="mr-2" />,
  label: "Edit",
  onClick,
});

export const createDisconnectItem = (onClick: () => void): DropdownItem => ({
  icon: <Unlink className="mr-2" />,
  label: "Disconnect",
  onClick,
  className: "text-destructive focus:text-destructive",
});

const DetailListItem: React.FC<DetailListItemProps> = ({
  dateDisplay,
  children,
  dropdownItems,
}) => {
  return (
    <div className="grid grid-cols-[1fr_40px_80px] gap-2 items-center py-2 px-1 hover:bg-accent/5">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <MoreHorizontal className="cursor-pointer hover:opacity-70 text-primary-foreground" />
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

export default DetailListItem;
