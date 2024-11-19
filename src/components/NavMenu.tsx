import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  // Extract familyId and petId from URL if they exist
  const matches = {
    family: location.pathname.match(/\/app\/family\/(\d+)/),
    pet: location.pathname.match(/\/app\/family\/\d+\/pet\/(\d+)/),
  };

  const familyId = matches.family?.[1];
  const petId = matches.pet?.[1];

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-yellow-300 transition-colors">
            <Menu className="h-6 w-6 text-gray-700" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/app")}>
            Switch Family
          </DropdownMenuItem>
          {familyId && (
            <DropdownMenuItem onSelect={() => handleMenuItemClick(`/app/family/${familyId}/edit`)}>
              Edit Family
            </DropdownMenuItem>
          )}
          {petId && (
            <DropdownMenuItem onSelect={() => handleMenuItemClick(`/app/family/${familyId}/pet/${petId}/edit`)}>
              Edit Pet
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/profile")}>
            User Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/logout")}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
