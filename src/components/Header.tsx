// TODELETE

import { useFamilyDataContext } from "@/context/FamilyDataContext";
import FamilyLink from "./FamilyLink";
import NavMenu from "./NavMenu";

const Header = () => {
  const {
    familyData,
    familyId,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFamilyDataContext();

  return (
    <div className="flex flex-row w-full z-50 justify-end gap-2 mt-2 mr-2">
      <FamilyLink familyId={familyId} familyName={familyData?.family_name} />
      <NavMenu />
    </div>
  );
};

export default Header;
