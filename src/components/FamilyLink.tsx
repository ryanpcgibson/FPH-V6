import { Link } from "react-router-dom";

interface FamilyLinkProps {
  familyId: number;
  familyName: string | undefined;
}

function FamilyLink({ familyId, familyName }: FamilyLinkProps) {
  return (
    <Link
      to={`/app/family/${familyId}`}
      className="text-xl font-bold text-blue-600 hover:text-blue-800"
    >
      {familyName}
    </Link>
  );
}

export default FamilyLink;
