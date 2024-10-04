import "./App.css";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/app/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import TestPage from "./pages/TestPage";
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/app/ProfilePage";
import FamilyLayout from "./pages/app/family/FamilyLayout";
import DataPage from "./pages/app/family/FamilyDataPage";
import TimelinePage from "./pages/app/family/FamilyTimelinePage";
import PetLayout from "./pages/app/family/pet/PetLayout";
import PetInfo from "./pages/app/family/pet/PetInfoPage";
import { UserProvider } from "./context/UserContext";
import LogoutPage from "./pages/LogoutPage";
import { FamiliesProvider } from "./context/UserFamiliesContext";
import FamilySelectPage from "./pages/app/FamilySelectPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <FamiliesProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/app" element={<ProtectedRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route index element={<FamilySelectPage />} />
                    <Route path="family/:familyId?" element={<FamilyLayout />}>
                      <Route index element={<TimelinePage />} />
                      <Route path="test" element={<DataPage />} />
                      <Route path="pet/:petId?" element={<PetLayout />}>
                        <Route index element={<PetInfo />} />
                      </Route>
                    </Route>
                  </Route>
                  <Route path="/logout" element={<LogoutPage />} />
                </Routes>
              </Suspense>
            </FamiliesProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
