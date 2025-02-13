import ColoredHeartIcon from "@/components/ColoredHeartIcon";
import { Globe, PawPrint, Heart } from "lucide-react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";

interface EntityLinkProps {
  item: { name: string; id: number };
  itemType: string;
  customOnClick?: () => void;
  isSelected?: boolean;
  iconOnly?: boolean;
  textOnly?: boolean;
}

const EntityLink: React.FC<EntityLinkProps> = ({
  item,
  itemType,
  customOnClick,
  isSelected,
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

  let icon = undefined;
  if (itemType === "moment") {
    // icon = <ColoredHeartIcon fillColor="#ff0000" outlineColor="black" />;
    icon = <Heart />;
  } else if (itemType === "location") {
    icon = <Globe />;
  } else if (itemType === "pet") {
    icon = <PawPrint />;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      className="cursor-pointer hover:underline w-full"
    >
      <div className="flex items-center gap-2">
        <span className="text-primary-foreground">{icon}</span>
        <span
          className={`truncate ${
            isSelected ? "text-accent font-medium" : "text-primary-foreground"
          }`}
        >
          {item.name}
        </span>
      </div>
    </div>
  );
};

export default EntityLink;
