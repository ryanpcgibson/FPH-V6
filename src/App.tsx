import "./App.css";
import { Suspense, useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
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


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/app"
              element={
                <FamiliesProvider>
                  <FamilyDataProvider>
                    <PetTimelineProvider>
                      <ProtectedRoute />
                    </PetTimelineProvider>
                  </FamilyDataProvider>
                </FamiliesProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
