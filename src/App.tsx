import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/Auth";
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/ProfilePage";
import FamilyLayout from "./pages/family/FamilyLayout";
import DataPage from "./pages/family/FamilyDataPage";
import TimelinePage from "./pages/family/FamilyTimelinePage";
import PetLayout from "./pages/family/pet/PetLayout";
import PetInfo from "./pages/family/pet/PetInfoPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="/family/:familyId?" element={<FamilyLayout />}>
                <Route index element={<TimelinePage />} />
                <Route path="test" element={<DataPage />} />
                <Route path="pet/:petId?" element={<PetLayout />}>
                  <Route index element={<PetInfo />} />
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
