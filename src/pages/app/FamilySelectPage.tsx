// This might end up a component, or menu item
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import FamilyLink from "@/components/FamilyLink";

const FamilySelectPage = () => {
  const { families, isLoading, error } = useUserFamiliesContext();

  return (
    <div className="w-full h-screen overflow-scroll">
      <div className="flex flex-col gap-2">
        {families.map((family) => (
          <div className="w-full flex items-center justify-between p-2 bg-yellow-400" key={family.id}>
            <FamilyLink familyId={family.id} familyName={family.name} />
            <span>({family.member_type})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilySelectPage;
