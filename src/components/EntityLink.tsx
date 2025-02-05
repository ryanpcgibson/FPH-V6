import ColoredHeartIcon from "@/components/ColoredHeartIcon";
import { GlobeIcon } from "@radix-ui/react-icons";
import PawPrintIcon from "@/components/PawPrintIcon";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";

const EntityLink = ({
  item,
  itemType,
  customOnClick,
}: {
  item: { name: string; id: number };
  itemType: string;
  customOnClick?: () => void;
}) => {
  const { selectedFamilyId } = useFamilyDataContext();
  const navigate = useNavigate();

  const handleClick = () => {
    if (customOnClick) {
      customOnClick();
    } else {
      navigate(
        `/app/family/${selectedFamilyId}/${itemType}/${item.id.toString()}`
      );
    }
  };

  let customIcon = undefined;
  if (itemType === "moment") {
    customIcon = <ColoredHeartIcon fillColor="#ff0000" outlineColor="black" />;
  } else if (itemType === "location") {
    customIcon = <GlobeIcon />;
  } else if (itemType === "pet") {
    customIcon = <PawPrintIcon />;
  }

  return (
    <div
      className="cursor-pointer hover:underline w-full"
      onClick={(e) => {
        e.stopPropagation(); // Prevent accordion from toggling
        handleClick();
      }}
    >
      <div className="flex items-center gap-2">
        {customIcon}
        <span className="truncate">{item.name}</span>
      </div>
    </div>
  );
};

export default EntityLink;
