import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface TimelineGridHandle {
  scrollToYear: (year: number) => void;
}

const PetInfoGrid: React.FC = () => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSegmentClick = (itemId: number, momentId?: number) => {
    if (momentId) {
      navigate(`/pet/${itemId}`, { state: { momentId } });
    }
  };

  return <div>{/* Add your pet info grid content here */}</div>;
};

export default PetInfoGrid;
