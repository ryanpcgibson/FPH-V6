import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const AppLayout = () => {
  let contentClassName = "flex-1 overflow-auto p-4";
  const location = useLocation();
  if (!location.pathname.endsWith("/data")) {
    contentClassName += " max-w-[800px]";
  }
  
  return (
    <div className="h-screen w-screen flex flex-col" id="app-layout">
      <AppHeader />
      <div className="flex justify-center flex-1 overflow-hidden">
        <div className={contentClassName} id="app-content-layout">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
