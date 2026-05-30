import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

// Layout & Navigation
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CoursePlayer from './pages/CoursePlayer';
import ChallengeList from './pages/ChallengeList';
import CodingPlayground from './pages/CodingPlayground';
import VerifyCertificate from './pages/VerifyCertificate';
import SmartTools from './pages/SmartTools';

// Scroll to Top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route security for logged-in users
const ProtectedRoute = ({ children }) => {
  const token = useStore((state) => state.token);
  return token ? children : <Navigate to="/auth" replace />;
};

// Role-based route controller
const RoleRoute = ({ children, allowedRoles }) => {
  const user = useStore((state) => state.user);
  const token = useStore((state) => state.token);

  if (!token) return <Navigate to="/auth" replace />;
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect based on role if logged in but unauthorized
    const defaultRoute = user?.role === 'instructor' 
      ? '/dashboard/instructor' 
      : user?.role === 'admin' 
        ? '/admin' 
        : '/dashboard/student';
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

// Main Layout component (Hides navbar on coding sandbox and course player for max workspace)
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/challenge/') || location.pathname.startsWith('/course/');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
};

function App() {
  const initTheme = useStore((state) => state.initTheme);
  const fetchUser = useStore((state) => state.fetchUser);
  const token = useStore((state) => state.token);

  useEffect(() => {
    initTheme();
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <Router>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/smart-tools" element={<SmartTools />} />
          <Route path="/certificate/verify/:hash" element={<VerifyCertificate />} />

          {/* Student Protected Routes */}
          <Route 
            path="/dashboard/student" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['student', 'admin']}>
                  <StudentDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* Instructor Protected Routes */}
          <Route 
            path="/dashboard/instructor" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['instructor', 'admin']}>
                  <InstructorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* Dynamic Playback & Coding Sandbox */}
          <Route 
            path="/course/:id" 
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges" 
            element={
              <ProtectedRoute>
                <ChallengeList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenge/:id" 
            element={
              <ProtectedRoute>
                <CodingPlayground />
              </ProtectedRoute>
            } 
          />

          {/* Default fallback redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
