import { useFamilyDataContext } from "@/context/FamilyDataContext";

const FamilyHeader: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { familyData, familyId } = useFamilyDataContext();

  return (
    <div
      className={`flex items-center justify-center align-middle header-box bg-yellow-400 ${className}`}
      data-testid="family-header"
    >
      <a href={`/app/family/${familyId}`} className="text-xl">
        <span className="whitespace-nowrap">
          The {familyData?.family_name} Family
        </span>
      </a>
    </div>
  );
};

export default FamilyHeader;
