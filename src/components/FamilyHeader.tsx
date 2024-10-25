import { useFamilyDataContext } from "@/context/FamilyDataContext";
import NavMenu from "@/components/NavMenu";

const FamilyHeader: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { familyData, familyId } = useFamilyDataContext();

  return (
    <div
      className={`flex items-center justify-between header-box bg-yellow-400 ${className}`}
      data-testid="family-header"
    >
      <div className="flex-grow" /> {/* Spacer */}
      <div className="text-center">
        <a href={`/app/family/${familyId}`} className="text-xl">
          <span className="whitespace-nowrap">
            The {familyData?.family_name} Family
          </span>
        </a>
      </div>
      <div className="flex-grow flex justify-end">
        <NavMenu />
      </div>
    </div>
  );
};

export default FamilyHeader;
