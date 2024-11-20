import { useFamilyDataContext } from "@/context/FamilyDataContext";
import NavMenu from "@/components/NavMenu";
import FamilyLink from "./FamilyLink";

const AppHeader: React.FC = () => {
  let familyId = undefined;
  let familyName = undefined;
  try {
    ({ familyId, familyName } = useFamilyDataContext());
  } catch {}

  const headerContent = familyId ? (
    <FamilyLink familyId={familyId} familyName={familyName} />
  ) : (
    // TODO: this seems janky, since technically any page could have this "title" so refactor TBD where app header title is set by route
    <div>Choose a Family</div>
  );

  return (
    <div
      className={`w-full h-8 flex items-center justify-between bg-yellow-400 `}
      id="family-header"
    >
      <div className="flex-grow" />
      <div className="text-center text-black font-bold text-xl">
        {headerContent}
      </div>
      <div className="flex-grow flex justify-end">
        <NavMenu />
      </div>
    </div>
  );
};

export default AppHeader;
