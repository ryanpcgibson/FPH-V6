import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

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
      className="flex flex-col w-screen h-screen max-w-[1000px] max-h-[500px] mx-auto pl-2 pr-2 bg-white"
      id="app-layout"
    >
      <div className="sticky top-0 z-50 bg-white">
        <AppHeader />
      </div>
      <div
        className="w-full h-[calc(100vh-54px)] max-h-[446px] my-[8px] overflow-hidden"
        id="app-content-layout"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
