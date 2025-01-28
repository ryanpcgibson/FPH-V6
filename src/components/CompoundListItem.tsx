import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CameraIcon } from "lucide-react";
import DateSpan from "./DateSpan";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

interface CompoundListItemProps {
  id: number;
  title: string;
  start_date: Date | undefined;
  end_date?: Date | undefined;
  customOnClick: () => void;
  url: string;
  icon: React.ReactNode;
}

const CompoundListItem: React.FC<CompoundListItemProps> = ({
  id,
  title,
  start_date = undefined,
  end_date = undefined,
  customOnClick,
  url,
  icon,
}) => {
  const { selectedFamilyId } = useFamilyDataContext();

  return (
    <AccordionItem key={id} value={id.toString()}>
      <AccordionTrigger>
        <div className="flex justify-between items-center w-full">
          <div
            className="cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation(); // Prevent accordion from toggling
              customOnClick();
            }}
          >
            <div className="flex items-center gap-2">
              {icon}
              {title}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <DateSpan start_date={start_date} end_date={end_date} />
        <div className="text-right">
          <a href={`/app/family/${selectedFamilyId}/${url}`}>more...</a>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CompoundListItem;
