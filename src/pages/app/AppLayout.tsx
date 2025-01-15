import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const AppLayout = () => {
  // TODO: this got lost in the refactor
  let contentClassName = "flex-1 overflow-auto p-4";
  const location = useLocation();
  if (!location.pathname.endsWith("/data")) {
    contentClassName += " max-w-[800px]";
  }

  return (
    <div
      className="h-screen w-screen flex flex-col  max-w-[800px] mr-auto ml-auto"
      id="app-layout"
    >
      <AppHeader />
      <div className="w-full p-4" id="app-content-layout">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
