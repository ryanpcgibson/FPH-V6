// pages/AppDataPage.tsx - debugging page to see raw family data

import React from "react";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import { useAuth } from "@/context/AuthContext";
import { JsonToTable } from "react-json-to-table";

const AppDataPage: React.FC = () => {
  const { families } = useUserFamiliesContext();
  const { user, session } = useAuth();

  return (
    <>
      <h1>User</h1>
      <JsonToTable json={user} />
      <h1>Session</h1>
      <JsonToTable json={session} />
      <h1>Families</h1>
      <JsonToTable json={families} />
    </>
  );
};

export default AppDataPage;
