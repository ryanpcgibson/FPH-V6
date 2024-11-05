import "./App.css";
import { Suspense, useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";

import FamiliesProvider from "@/context/UserFamiliesContext";
import FamilyDataProvider from "@/context/FamilyDataContext";
import PetTimelineProvider from "@/context/PetTimelineContext";

import WelcomePage from "@/pages/WelcomePage";
import ProtectedRoute from "@/pages/app/AppDataProtected";
import FamilyData from "@/pages/app/family/FamilyDataPage";
import AppData from "@/pages/app/AppDataPage";
import AppLayout from "@/pages/app/AppLayout";

import ProfilePage from "./pages/app/ProfilePage";

import TimelinePage from "./pages/app/family/FamilyTimelinePage";

import PetInfo from "./pages/app/family/pet/PetInfoPage";

import LogoutPage from "./pages/LogoutPage";
import FamilySelectPage from "./pages/app/FamilySelectPage";

// TODO: move this logic into sub components. Pass in the className to layo
function AppLayoutWrapper() {
  const location = useLocation();
  const appClassName = location.pathname.endsWith("/data")
    ? ""
    : "w-full max-w-[800px] max-h-[500px] h-full p-0 md:p-4 lg:p-8 flex flex-col justify-center overflow-hidden";

  return <AppLayout appClassName={appClassName} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FamiliesProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route
                path="/app"
                element={
                  <FamilyDataProvider>
                    <PetTimelineProvider>
                      <ProtectedRoute />
                    </PetTimelineProvider>
                  </FamilyDataProvider>
                }
              >
                <Route path="data" element={<AppData />} />
                <Route element={<AppLayout />}>
                  <Route path="data" element={<FamilyData />} />
                  <Route index element={<FamilySelectPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="family/:familyId">
                    <Route index element={<TimelinePage />} />
                    <Route path="pet/:petId?" element={<PetInfo />} />
                    <Route path="data" element={<FamilyData />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </FamiliesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
