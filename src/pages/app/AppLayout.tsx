import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const AppLayout = ({ appClassName = "" }) => {
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className={appClassName} id="app-layout">
        <AppHeader className="w-full" />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
