// pages/AppDataPage.tsx - debugging page to see raw family data

import React from "react";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import { JsonToTable } from "react-json-to-table";

const AppDataPage: React.FC = () => {
  const { families } = useUserFamiliesContext();

  return <JsonToTable json={families} />;
};

export default AppDataPage;
