import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DateSpan from "./DateSpan";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { LinkBreak1Icon, Pencil1Icon } from "@radix-ui/react-icons";
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
import EntityLink from "@/components/EntityLink";

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

  const handleDisconnect = () => {
    if (customOnDisconnect) {
      customOnDisconnect();
    }
  };

  return (
    <AccordionItem value={itemType + "-" + item.id.toString()}>
      <AccordionTrigger>
        <div className="w-full flex items-center justify-between ">
          <EntityLink
            item={item}
            itemType={itemType}
            customOnClick={customOnClick}
          />
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
                  `/app/family/${selectedFamilyId}/${itemType}/${item.id.toString()}`
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
