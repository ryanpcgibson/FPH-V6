import * as React from "react";
import { useNavigate } from "react-router-dom";
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

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/family/7")}>
            Family 7
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleMenuItemClick("/family/7/pet/3")}
          >
            Pet 3
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/uitest")}>
            UI Test
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick("/logout")}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
