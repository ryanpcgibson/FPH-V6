import { useFamilyDataContext } from "@/context/FamilyDataContext";
import NavMenu from "@/components/NavMenu";
import FamilyLink from "./FamilyLink";

const AppHeader: React.FC<{ className?: string }> = ({ className = "" }) => {
  let familyId = undefined;
  let familyData = undefined;
  try {
    // if outside of FamilyDataProvider could throw error
    ({ familyData, familyId } = useFamilyDataContext());
  } catch {}

  const headerContent = familyId ? (
    <FamilyLink familyId={familyId} familyName={familyData?.family_name} />
  ) : (
    <div>Pet Timeline</div>
  );

  console.log("familyData", familyData);

  return (
    <div
      className={`flex items-center justify-between header-box bg-yellow-400 ${className}`}
      data-testid="family-header"
    >
      <div className="flex-grow" />
      <div className="text-center">{headerContent}</div>
      <div className="flex-grow flex justify-end">
        <NavMenu />
      </div>
    </div>
  );
};

export default AppHeader;
