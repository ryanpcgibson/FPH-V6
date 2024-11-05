import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const AppLayout = () => {
  let contentClassName =
    "w-full h-full p-4 flex flex-col gap-2 justify-center overflow-hidden";
  const location = useLocation();
  if (!location.pathname.endsWith("/data")) {
    contentClassName += " max-w-[800px] max-h-[500px]";
  }
  return (
    <div className="h-screen w-screen flex justify-center" id="app-layout">
      <div className={contentClassName} id="app-content-layout">
        <AppHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
