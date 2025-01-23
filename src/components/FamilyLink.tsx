import Link from "@/components/Link";

interface FamilyLinkProps {
  selectedFamilyId: number | null;
  selectedFamilyName: string | null;
}

function FamilyLink({ selectedFamilyId, selectedFamilyName }: FamilyLinkProps) {
  return (
    <Link href={`/app/family/${selectedFamilyId}`}>
      <span className="whitespace-nowrap">The {selectedFamilyName} Family</span>
    </Link>
  );
}

export default FamilyLink;
