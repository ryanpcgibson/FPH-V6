import Link from "@/components/Link";

interface FamilyLinkProps {
  familyId: number | null;
  familyName: string | undefined;
}

function FamilyLink({ familyId, familyName }: FamilyLinkProps) {
  return (
    <Link href={`/app/family/${familyId}`}>
      <span className="whitespace-nowrap">
        The {familyName} Family
      </span>
    </Link>
  );
}

export default FamilyLink;
