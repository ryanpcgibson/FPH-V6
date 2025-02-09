import "./index.css";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoadingLayout from "@/components/LoadingLayout";

import AuthProvider from "@/context/AuthContext";

import WelcomePage from "@/pages/WelcomePage";
import LogoutPage from "@/pages/LogoutPage";

import FamilyDataProvider from "@/context/FamilyDataContext";
import PetTimelineProvider from "@/context/PetTimelineContext";
import LocationTimelineProvider from "@/context/LocationTimelineContext";
import ProtectedRoute from "@/pages/app/ProtectedRoute";

const AppLayout = lazy(() => import('@/pages/app/AppLayout')); // prettier-ignore
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage')); // prettier-ignore
const FamilyListPage = lazy(() => import('@/pages/app/FamilyListPage')); // prettier-ignore
const TimelinePage = lazy(() => import('@/pages/app/family/FamilyTimelinePage')); // prettier-ignore
const FamilyData = lazy(() => import('@/pages/app/family/FamilyDataPage')); // prettier-ignore
const FamilyFormPage = lazy(() => import('@/pages/app/family/FamilyFormPage')); // prettier-ignore
const PetInfo = lazy(() => import('@/pages/app/family/pet/PetDetailPage')); // prettier-ignore
const PetFormPage = lazy(() => import('@/pages/app/family/pet/PetFormPage')); // prettier-ignore
const LocationInfo = lazy(() => import('@/pages/app/family/location/LocationDetailPage')); // prettier-ignore
const LocationFormPage = lazy(() => import('@/pages/app/family/location/LocationFormPage')); // prettier-ignore
const MomentFormPage = lazy(() => import('@/pages/app/family/moment/MomentFormPage')); // prettier-ignore

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
                <Route index element={<FamilyListPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="family/add" element={<FamilyFormPage />} />
                <Route path="family/:familyId">
                  <Route index element={<TimelinePage />} />
                  <Route path="pet/:petId" element={<PetInfo />} />
                  <Route path="pet/:petId/edit" element={<PetFormPage />} />
                  <Route path="pet/add" element={<PetFormPage />} />
                  <Route
                    path="location/:locationId"
                    element={<LocationInfo />}
                  />
                  <Route
                    path="location/:locationId/edit"
                    element={<LocationFormPage />}
                  />
                  <Route path="location/add" element={<LocationFormPage />} />
                  <Route
                    path="moment/:momentId/edit"
                    element={<MomentFormPage />}
                  />
                  <Route path="moment/add" element={<MomentFormPage />} />
                  <Route path="data" element={<FamilyData />} />
                  <Route path="edit" element={<FamilyFormPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
