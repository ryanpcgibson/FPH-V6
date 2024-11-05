// This might end up a component, or menu item
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import FamilyLink from "@/components/FamilyLink";

const FamilySelectPage = () => {
  const { families } = useUserFamiliesContext();

  return (
    <div className="w-full flex-grow overflow-auto flex flex-col space-y-2">
      {families.map((family) => (
        <div
          className="w-full h-8 flex items-center justify-between bg-yellow-400"
          key={family.id}
        >
          <div className="flex-grow" />
          <div className="text-center text-black font-bold text-xl">
            <FamilyLink familyId={family.id} familyName={family.name} />
          </div>
          <div className="flex-grow flex justify-end italic pr-2">
            <span>{family.member_type}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FamilySelectPage;
