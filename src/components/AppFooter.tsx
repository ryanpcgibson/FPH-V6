import { useNavigate } from "react-router-dom";
import { useFamilyData } from "@/hooks/useFamilyData";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const AppFooter = () => {
  const navigate = useNavigate();
  const { families } = useFamilyData();
  const { selectedFamilyId } = useFamilyDataContext();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-1 left-1 z-[100]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="fab"
            size="sm"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-300"
          >
            <Settings className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[100] bg-muted">
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

export default AppFooter;
