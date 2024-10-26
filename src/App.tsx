import "./App.css";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";

import FamiliesProvider from "@/context/UserFamiliesContext";
import FamilyDataProvider from "@/context/FamilyDataContext";
import PetTimelineProvider from "@/context/PetTimelineContext";

import WelcomePage from "./pages/WelcomePage";
import ProtectedRoute from "./pages/app/AppDataProtected";
import DataPage from "./pages/app/DataPage";
import FamilyLayout from "./pages/app/family/FamilyLayout";
import AppLayout from "./pages/app/AppLayout";

import ProfilePage from "./pages/app/ProfilePage";

import TimelinePage from "./pages/app/family/FamilyTimelinePage";

import PetInfo from "./pages/app/family/pet/PetInfoPage";

import LogoutPage from "./pages/LogoutPage";
import FamilySelectPage from "./pages/app/FamilySelectPage";

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
                  <Route element={<AppLayout />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="family/:familyId" element={
                      <FamilyDataProvider>
                        <PetTimelineProvider>
                          <Outlet />
                        </PetTimelineProvider>
                      </FamilyDataProvider>
                    }>
                      <Route path="data" element={<DataPage />} />
                      <Route element={<FamilyLayout />}>
                        <Route index element={<TimelinePage />} />
                        <Route path="pet/:petId?" element={<PetInfo />} />
                      </Route>
                    </Route>
                  </Route>
                  <Route index element={<FamilySelectPage />} />
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
