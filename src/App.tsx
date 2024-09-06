import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/Auth';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';
import FamilyPage from './pages/FamilyPage';
import TimelinePage from './pages/Timeline';

// Import UI Test Pages dynamically
const pages = import.meta.glob('./uitest/*.tsx');

// Create routes dynamically for UI test pages
const uiTestRoutes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/uitest\/(.*)\.tsx$/)?.[1];
  const Component = lazy(pages[path] as () => Promise<{ default: React.ComponentType<any> }>);

  return {
    path: `/uitest/${name}`,
    element: <Component />,
  };
});

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/family/:id?" element={<FamilyPage />} />

              {/* Dynamically generated routes for UI test pages 
                  Special case, just for development */}
              {uiTestRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              {/* Add a route for listing all UI test pages */}
              <Route
                path="/uitest"
                element={
                  <div>
                    <h1>UI Test Pages</h1>
                    <ul>
                      {uiTestRoutes.map((route) => (
                        <li key={route.path}>
                          <a href={route.path}>{route.path.replace('/uitest/', '')}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              />
            </Route>

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
