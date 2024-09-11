import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import TimelineBars from "../components/TimelineBars";
import ImageCarousel from "../components/ImageCarousel";
import NavMenu from "../components/NavMenu";

const drawerWidth = 430;

const mockData = [
  {
    width: 200,
    photo:
      "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
  },
  {
    width: 400,
    photo:
      "https://fastly.picsum.photos/id/19/2500/1667.jpg?hmac=7epGozH4QjToGaBf_xb2HbFTXoV5o8n_cYzB7I4lt6g",
  },
  {
    width: 800,
    photo:
      "https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4",
  },
  {
    width: 1200,
    photo:
      "https://fastly.picsum.photos/id/23/3887/4899.jpg?hmac=2fo1Y0AgEkeL2juaEBqKPbnEKm_5Mp0M2nuaVERE6eE",
  },
];

const TimelinePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const handleBarClick = (photo: string) => {
    setSelectedPhoto(photo);
    setOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[430px] p-0">
          {selectedPhoto && (
            <ImageCarousel photo={selectedPhoto} closeDrawer={closeDrawer} />
          )}
        </SheetContent>
        <main className="flex-grow p-6 overflow-auto">
          <TimelineBars data={mockData} onBarClick={handleBarClick} />
        </main>
      </Sheet>
    </div>
  );
};

export default TimelinePage;
