import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const AppLayout = () => {
  return (
    <div
      className="flex flex-col w-screen h-screen max-w-[1000px] max-h-[500px] mr-auto ml-auto"
      id="app-layout"
    >
      <AppHeader />
      <div
        className="flex-1 w-full p-4 overflow-hidden"
        id="app-content-layout"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
