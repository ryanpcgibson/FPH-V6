import { Link } from "react-router-dom";

interface FamilyLinkProps {
  familyId: number;
  familyName: string | undefined;
}

function FamilyLink({ familyId, familyName }: FamilyLinkProps) {
  return (
    <a
      href={`/app/family/${familyId}`}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      The {familyName} Family{" "}
    </a>
  );
}

export default FamilyLink;
