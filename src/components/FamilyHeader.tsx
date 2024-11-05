import { useFamilyDataContext } from "@/context/FamilyDataContext";
import NavMenu from "@/components/NavMenu";
import FamilyLink from "./FamilyLink";

const FamilyHeader: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { familyData, familyId } = useFamilyDataContext();

  return (
    <div
      className={`flex items-center justify-between header-box bg-yellow-400 ${className}`}
      data-testid="family-header"
    >
      <div className="flex-grow" /> {/* Spacer */}
      <div className="text-center">
        <FamilyLink familyId={familyId} familyName={familyData?.family_name} />
      </div>
      <div className="flex-grow flex justify-end">
        <NavMenu />
      </div>
    </div>
  );
};

export default FamilyHeader;
