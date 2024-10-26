import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="h-screen w-screen flex justify-center border border-blue-600">
      <div
        className=""
        id="app-layout"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
