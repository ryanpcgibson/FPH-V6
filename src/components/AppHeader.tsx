import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
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
  const { selectedFamilyId, selectedFamilyName } = useFamilyDataContext();

  return (
    <Card className="w-full flex justify-end rounded-t-none">
      <div
        className="whitespace-nowrap flex items-center px-2"
        id="app-header-text-container"
      >
        <Link
          to={`/app/family/${selectedFamilyId}`}
          className="text-xl font-bold text-primary-foreground"
        >
          {selectedFamilyName && `The ${selectedFamilyName} Family`}
        </Link>
      </div>
      <NavMenu />
    </Card>
  );
};

export default AppHeader;
