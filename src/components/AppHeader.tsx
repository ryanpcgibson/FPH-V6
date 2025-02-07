import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { useLocationTimelineContext } from "@/context/LocationTimelineContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Menu, ArrowRight } from "lucide-react";
import { useFamilyData } from "@/hooks/useFamilyData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "./ui/card";

const NavMenu = () => {
  const navigate = useNavigate();
  const { families } = useFamilyData();
  const { selectedFamilyId } = useFamilyDataContext();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="">
            <Menu className="h-6 w-6 " />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Switch Family</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {families
                ?.filter((family) => family.id !== selectedFamilyId)
                .map((family) => (
                  <DropdownMenuItem
                    key={family.id}
                    onSelect={() =>
                      handleMenuItemClick(`/app/family/${family.id}`)
                    }
                  >
                    {family.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            onSelect={() => handleMenuItemClick("/app/profile")}
          >
            User Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/logout")}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const AppHeader: React.FC = () => {
  const { families } = useFamilyData();

  const location = useLocation();
  const isEditView = location.pathname.includes("/edit");

  let selectedFamilyId = null;
  let selectedFamilyName = null;
  let selectedPetName = null;
  let selectedPetId = null;
  let selectedLocationName = null;
  let selectedLocationId = null;

  try {
    ({ selectedFamilyId, selectedFamilyName } = useFamilyDataContext());
  } catch {}

  try {
    ({ selectedPetName, selectedPetId } = usePetTimelineContext());
  } catch {}

  try {
    ({ selectedLocationName, selectedLocationId } =
      useLocationTimelineContext());
  } catch {}

  const getEditPath = () => {
    if (selectedPetId) {
      return `/app/family/${selectedFamilyId}/pet/${selectedPetId}/edit`;
    }
    if (selectedLocationId) {
      return `/app/family/${selectedFamilyId}/location/${selectedLocationId}/edit`;
    }
    return `/app/family/${selectedFamilyId}/edit`;
  };

  const getAriaLabel = () => {
    if (selectedPetId) return "Edit Pet";
    if (selectedLocationId) return "Edit Location";
    return "Edit Family";
  };

  const editLink = selectedFamilyId && !isEditView && (
    <Link
      to={getEditPath()}
      className="p-2 transition-colors rounded-md"
      aria-label={getAriaLabel()}
    >
      <Pencil className="h-4 w-4 text-foreground" />
    </Link>
  );

  return (
    <Card className="w-full flex justify-between rounded-t-none">
      <div
        className="whitespace-nowrap flex items-center px-2"
        id="app-header-text-container"
      >
        <Link
          to={`/app/family/${selectedFamilyId}`}
          className="text-xl font-bold text-foreground"
        >
          {selectedFamilyName && `The ${selectedFamilyName} Family`}
        </Link>
      </div>
      <NavMenu />
    </Card>
  );
};

export default AppHeader;
