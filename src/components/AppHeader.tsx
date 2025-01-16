import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import NavMenu from "@/components/NavMenu";
import FamilyLink from "./FamilyLink";
import { Link, useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";

const AppHeader: React.FC = () => {
  const location = useLocation();
  const isEditView = location.pathname.includes('/edit');
  
  let selectedFamilyId = null;
  let selectedFamilyName = null;
  let selectedPetName = null;
  let selectedPetId = null;
  
  try {
    ({ selectedFamilyId, selectedFamilyName } = useFamilyDataContext());
  } catch {}

  try {
    ({ selectedPetName, selectedPetId } = usePetTimelineContext());
  } catch {}

  let headerContent = null;
  if (selectedFamilyId) {
    headerContent = (
      <>
        <FamilyLink
          selectedFamilyId={selectedFamilyId}
          selectedFamilyName={selectedFamilyName}
        />
        {selectedPetName && ` > ${selectedPetName}`}
      </>
    );
  } else {
    headerContent = "Choose a Family";
  }

  const editLink = selectedFamilyId && !isEditView && (
    <Link
      to={
        selectedPetId
          ? `/app/family/${selectedFamilyId}/pet/${selectedPetId}/edit`
          : `/app/family/${selectedFamilyId}/edit`
      }
      className="p-2 hover:bg-yellow-300 transition-colors rounded-md"
      aria-label={selectedPetId ? "Edit Pet" : "Edit Family"}
    >
      <Pencil className="h-4 w-4 text-gray-700" />
    </Link>
  );

  return (
    <div
      className={`w-full h-8 flex items-center justify-between bg-yellow-400 rounded-b-lg`}
      id="family-header"
    >
      <div className="flex-grow" />
      <div className="text-center text-black font-bold text-xl">
        {headerContent}
      </div>
      <div className="flex-grow flex justify-end items-center gap-2">
        {editLink}
        <NavMenu />
      </div>
    </div>
  );
};

export default AppHeader;
