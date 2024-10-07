import { Link } from "react-router-dom";

interface FamilyLinkProps {
  familyId: number;
  familyName: string | undefined;
}

function FamilyLink({ familyId, familyName }: FamilyLinkProps) {
  return (
    <a href={`/app/family/${familyId}`} className="">
      The {familyName} Family{" "}
    </a>
  );
}

export default FamilyLink;
