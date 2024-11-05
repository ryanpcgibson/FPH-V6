import { Link } from "react-router-dom";

interface FamilyLinkProps {
  familyId: number | null;
  familyName: string | undefined;
}

function FamilyLink({ familyId, familyName }: FamilyLinkProps) {
  return (
    <a href={`/app/family/${familyId}`} className="text-xl">
      <span className="whitespace-nowrap hover:font-bold">
        The {familyName} Family
      </span>
    </a>
  );
}

export default FamilyLink;
