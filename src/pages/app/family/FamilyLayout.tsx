import React from "react";
import { Outlet } from "react-router-dom";
import FamilyHeader from "@/components/FamilyHeader";

interface FamilyLayoutProps {
  debugLayout?: boolean;
}

const FamilyLayout: React.FC<FamilyLayoutProps> = ({ debugLayout = false }) => {
  return (
    <>
      {!debugLayout && <FamilyHeader className="w-full" />}
      <Outlet />
    </>
  );
};

export default FamilyLayout;
