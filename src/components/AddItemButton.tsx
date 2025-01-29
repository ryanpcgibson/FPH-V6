import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddItemButton = ({ headerWidth }: { headerWidth: number }) => {
  const navigate = useNavigate();
  const { familyId } = useParams<{ familyId: string }>();

  const handleAddPet = () => {
    navigate(`/app/family/${familyId}/pet/add`);
  };

  const handleAddLocation = () => {
    navigate(`/app/family/${familyId}/location/add`);
  };

  return (
    <div
      className="relative flex w-full justify-end items-center"
      id="add-item-button-row"
    >
      <div
        className="h-10 sticky right-0 z-20 flex items-center bg-card justify-between px-2 "
        style={{ width: `${headerWidth}px` }}
        id="add-item-button"
      >
        <div className="w-full h-full flex items-center justify-between px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-full flex items-center justify-center"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleAddPet}>
                Add Pet
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleAddLocation}>
                Add Location
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default AddItemButton;
