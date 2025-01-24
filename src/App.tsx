import "./App.css";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingLayout from "@/components/LoadingLayout";

import AuthProvider from "@/context/AuthContext";

import FamilyDataProvider from "@/context/FamilyDataContext";
import PetTimelineProvider from "@/context/PetTimelineContext";
import LocationTimelineProvider from "@/context/LocationTimelineContext";

import WelcomePage from "@/pages/WelcomePage";
import ProtectedRoute from "@/pages/app/AppDataProtected";
import AppLayout from "@/pages/app/AppLayout";
import LogoutPage from "@/pages/LogoutPage";
import ProfilePage from "@/pages/app/ProfilePage";

import TimelinePage from "@/pages/app/family/FamilyTimelinePage";
import FamilySelectPage from "@/pages/app/FamilySelectPage";
import FamilyData from "@/pages/app/family/FamilyDataPage";
import FamilyFormPage from "@/pages/app/family/FamilyFormPage";

import PetInfo from "@/pages/app/family/pet/PetDetailPage";
import PetFormPage from "@/pages/app/family/pet/PetFormPage";

import LocationInfo from "@/pages/app/family/location/LocationDetailPage";
import LocationFormPage from "@/pages/app/family/location/LocationFormPage";

import MomentInfo from "@/pages/app/family/moment/MomentDetailPage";
import MomentFormPage from "@/pages/app/family/moment/MomentFormPage";

import TestPage from "./pages/app/TestPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={<LoadingLayout isLoading>Loading...</LoadingLayout>}
        >
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/app"
              element={
                <FamilyDataProvider>
                  <PetTimelineProvider>
                    <LocationTimelineProvider>
                      <ProtectedRoute />
                    </LocationTimelineProvider>
                  </PetTimelineProvider>
                </FamilyDataProvider>
              }
            >
              <Route element={<AppLayout />}>
                <Route path="test" element={<TestPage />} />
                <Route path="data" element={<FamilyData />} />
                <Route index element={<FamilySelectPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="family/add" element={<FamilyFormPage />} />
                <Route path="family/:familyId">
                  <Route index element={<TimelinePage />} />
                  <Route path="pet/:petId?" element={<PetInfo />} />
                  <Route path="pet/:petId/edit" element={<PetFormPage />} />
                  <Route path="pet/add" element={<PetFormPage />} />
                  <Route
                    path="location/:locationId?"
                    element={<LocationInfo />}
                  />
                  <Route
                    path="location/:locationId/edit"
                    element={<LocationFormPage />}
                  />
                  <Route path="location/add" element={<LocationFormPage />} />
                  <Route path="moment/:momentId?" element={<MomentInfo />} />
                  <Route
                    path="moment/:momentId/edit"
                    element={<MomentFormPage />}
                  />
                  <Route path="moment/add" element={<MomentFormPage />} />
                  <Route path="data" element={<FamilyData />} />
                  <Route path="edit" element={<FamilyFormPage />} />
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
