// This might end up a component, or menu item
import { useFamilyData } from "@/hooks/useFamilyData";
import FamilyLink from "@/components/FamilyLink";

const FamilySelectPage = () => {
  const { families } = useFamilyData();

  return (
    <div className="w-full flex-grow overflow-auto flex flex-col space-y-2">
      {families?.map((family) => (
        <div
          className="w-full h-8 flex items-center justify-between bg-yellow-400"
          key={family.id}
        >
          <div className="flex-grow" />
          <div className="text-center text-black font-bold text-xl">
            <FamilyLink selectedFamilyId={family.id} selectedFamilyName={family.name} />
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
