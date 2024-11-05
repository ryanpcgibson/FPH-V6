import { Outlet } from "react-router-dom";

const AppLayout = ({ debugLayout = false }) => {
  const appClassName = debugLayout
    ? ""
    : "w-full max-w-[800px] max-h-[500px] h-full p-0 md:p-4 lg:p-8 flex flex-col justify-center overflow-hidden";
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className={appClassName} id="app-layout">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
