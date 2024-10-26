import React from "react";
import { Outlet } from "react-router-dom";
import FamilyHeader from "@/components/FamilyHeader";

const FamilyLayout: React.FC = () => {
  return (
    <div className="w-full max-w-[800px] max-h-[500px] h-full p-0 md:p-4 lg:p-8 flex flex-col justify-center overflow-hidden">
      <FamilyHeader className="w-full " />
      <Outlet />
    </div>
  );
};

export default FamilyLayout;
