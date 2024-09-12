import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import TimelineBars from "../../components/TimelineBars";
import ImageCarousel from "../../components/ImageCarousel";

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
