import React from "react";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import FamilyLink from "@/components/FamilyLink";

interface FamilyTableProps {
  familyId?: number;
}

const FamiliesTable: React.FC<FamilyTableProps> = ({ familyId }) => {
  const { families, isLoading, error } = useUserFamiliesContext();

  return (
    <table className="border-collapse mb-4 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Current</th>
          <th className="border border-gray-300 p-2">ID</th>
          <th className="border border-gray-300 p-2">Name</th>
          <th className="border border-gray-300 p-2">Member Type</th>
        </tr>
      </thead>
      <tbody>
        {families.map((family) => (
          <tr key={family.id}>
            <td className="border border-gray-300 p-2 text-center">
              {family.id === familyId ? "*" : ""}
            </td>
            <td className="border border-gray-300 p-2">{family.id}</td>
            <td className="border border-gray-300 p-2">
              <FamilyLink familyId={family.id} familyName={family.name} />
            </td>
            <td className="border border-gray-300 p-2">{family.member_type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FamiliesTable;
