import "./App.css";
import { Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";

import FamiliesProvider from "@/context/UserFamiliesContext";
import FamilyDataProvider from "@/context/FamilyDataContext";
import PetTimelineProvider from "@/context/PetTimelineContext";

import WelcomePage from "@/pages/WelcomePage";
import ProtectedRoute from "@/pages/app/AppDataProtected";
import FamilyData from "@/pages/app/family/FamilyDataPage";
import AppData from "@/pages/app/AppDataPage";
import FamilyLayout from "@/pages/app/family/FamilyLayout";
import AppLayout from "@/pages/app/AppLayout";

import ProfilePage from "./pages/app/ProfilePage";

import TimelinePage from "./pages/app/family/FamilyTimelinePage";

import PetInfo from "./pages/app/family/pet/PetInfoPage";

import LogoutPage from "./pages/LogoutPage";
import FamilySelectPage from "./pages/app/FamilySelectPage";

function AppLayoutWrapper() {
  const location = useLocation();
  return <AppLayout debugLayout={location.pathname.endsWith("/data")} />;
}

function FamilyLayoutWrapper() {
  const location = useLocation();
  const debugLayout = location.pathname.endsWith("/data");

  return <FamilyLayout debugLayout={debugLayout} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <FamiliesProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/app" element={<ProtectedRoute />}>
                  <Route path="data" element={<AppData />} />
                  <Route element={<AppLayoutWrapper />}>
                    <Route index element={<FamilySelectPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="data" element={<FamilyData />} />
                    <Route
                      path="family/:familyId"
                      element={
                        <FamilyDataProvider>
                          <PetTimelineProvider>
                            <FamilyLayoutWrapper />
                          </PetTimelineProvider>
                        </FamilyDataProvider>
                      }
                    >
                      <Route index element={<TimelinePage />} />
                      <Route path="pet/:petId?" element={<PetInfo />} />
                      <Route path="data" element={<FamilyData />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </FamiliesProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
