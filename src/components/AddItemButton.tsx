import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddItemButton = () => {
  const navigate = useNavigate();
  const { familyId } = useParams<{ familyId: string }>();

  const handleAddPet = () => {
    navigate(`/app/family/${familyId}/pet/add`);
  };

  const handleAddLocation = () => {
    navigate(`/app/family/${familyId}/location/add`);
  };

  return (
    <div className="relative flex w-full" id="add-item-row">
      {/* Empty cells to match timeline width */}
      <div className="flex-grow flex w-full">
        {/* This div will take up the space of the timeline cells */}
      </div>

      {/* Add Button */}
      <div className="sticky right-0 z-20 w-28 h-10 flex items-center justify-center bg-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded-lg"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleAddPet}>Add Pet</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleAddLocation}>
              Add Location
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AddItemButton;
