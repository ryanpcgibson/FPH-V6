import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DateSpan from "./DateSpan";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import {
  CameraIcon,
  GlobeIcon,
  LinkBreak1Icon,
  Pencil1Icon,
  HeartIcon,
} from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface CompoundListItemProps {
  item: any;
  itemType: string;
  customOnClick?: () => void;
  customOnDisconnect?: () => void;
}

const CompoundListItem: React.FC<CompoundListItemProps> = ({
  item,
  itemType,
  customOnClick,
  customOnDisconnect,
}) => {
  const { selectedFamilyId } = useFamilyDataContext();
  const navigate = useNavigate();

  const handleClick = () => {
    if (customOnClick) {
      customOnClick();
    } else {
      navigate(`/app/family/${selectedFamilyId}/${itemType}/${item.id}`);
    }
  };

  const handleDisconnect = () => {
    if (customOnDisconnect) {
      customOnDisconnect();
    }
  };

  let customIcon = undefined;
  if (itemType === "moment") {
    customIcon = <CameraIcon />;
  } else if (itemType === "location") {
    customIcon = <GlobeIcon />;
  } else if (itemType === "pet") {
    customIcon = <HeartIcon />;
  }

  return (
    <AccordionItem value={itemType + "-" + item.id.toString()}>
      <AccordionTrigger>
        <div className="flex justify-between items-center w-full">
          <div
            className="cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation(); // Prevent accordion from toggling
              handleClick();
            }}
          >
            <div className="flex items-center gap-2">
              {customIcon}
              {item.name}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex justify-between items-center w-full">
          <DateSpan start_date={item.start_date} end_date={item.end_date} />
          <div className="flex items-center gap-2">
            <Pencil1Icon
              className="cursor-pointer hover:opacity-70"
              onClick={() =>
                navigate(
                  `/app/family/${selectedFamilyId}/${itemType}/${item.id}/edit`
                )
              }
            />
            {itemType === "moment" && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <LinkBreak1Icon className="cursor-pointer hover:opacity-70" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Manage Connection</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to disconnect this {itemType}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDisconnect}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CompoundListItem;
