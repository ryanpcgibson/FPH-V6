import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const AppLayout = () => {
  const { error, isLoading } = useFamilyDataContext();
  if (error) {
    return <div>Error fetching family data: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading family data...</div>;
  }
  return (
    <div
      className="flex flex-col w-screen h-screen max-w-[1000px] landscape:max-h-[500px] mx-auto px-2 bg-white"
      id="app-layout"
    >
      <AppHeader />
      <div className="h-1.5 sticky top-0 z-50 bg-white"></div>
      <div className="w-full flex-1 overflow-hidden" id="app-content-layout">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
};

export default AppLayout;
