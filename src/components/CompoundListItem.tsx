import { useFamilyDataContext } from "@/context/FamilyDataContext";
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  LinkBreak1Icon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import EntityLink from "@/components/EntityLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import DetailListItem from "@/components/DetailListItem";

interface CompoundListItemProps {
  item: any;
  itemType: string;
  customOnClick?: () => void;
  customOnDisconnect?: () => void;
  isSelected?: boolean;
}

const CompoundListItem: React.FC<CompoundListItemProps> = ({
  item,
  itemType,
  customOnClick,
  customOnDisconnect,
  isSelected = false,
}) => {
  const { selectedFamilyId } = useFamilyDataContext();
  const navigate = useNavigate();

  const dropdownItems = [
    {
      icon: <Pencil1Icon className="mr-2" />,
      label: "Edit",
      onClick: () =>
        navigate(
          `/app/family/${selectedFamilyId}/${itemType}/${item.id.toString()}/edit`
        ),
    },
  ];

  if (itemType === "moment" && customOnDisconnect) {
    dropdownItems.push({
      icon: <LinkBreak1Icon className="mr-2" />,
      label: "Disconnect",
      onClick: customOnDisconnect,
      className: "text-destructive focus:text-destructive",
    });
  }

  return (
    <DetailListItem
      startDate={item.start_date}
      endDate={item.end_date}
      dropdownItems={dropdownItems}
    >
      <EntityLink
        item={item}
        itemType={itemType}
        customOnClick={customOnClick}
        isSelected={isSelected}
      />
    </DetailListItem>
  );
};

export default CompoundListItem;
