import { Link } from "react-router-dom";

interface FamilyLinkProps {
  familyId: number | null;
  familyName: string | undefined;
}

function FamilyLink({ familyId, familyName }: FamilyLinkProps) {
  return (
    <a href={`/app/family/${familyId}`} className="">
      <span className="whitespace-nowrap hover:font-underline">
        The {familyName} Family
      </span>
    </a>
  );
}

export default FamilyLink;
