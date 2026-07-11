import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/common/Navbar';
import { AuthGuard } from './components/common/AuthGuard';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Patients = lazy(() => import('./pages/Patients').then(m => ({ default: m.Patients })));
const Doctors = lazy(() => import('./pages/Doctors').then(m => ({ default: m.Doctors })));
const Appointments = lazy(() => import('./pages/Appointments').then(m => ({ default: m.Appointments })));
const PatientMedicalFilePage = lazy(() => import('./pages/PatientMedicalFilePage').then(m => ({ default: m.PatientMedicalFilePage })));

function App() {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />

              <Route
                path="/appointments"
                element={
                  <AuthGuard>
                    <Appointments />
                  </AuthGuard>
                }
              />

              <Route
                path="/patients"
                element={
                  <AuthGuard requiredRole={['ADMIN', 'DOCTOR', 'RECEPTIONIST'] as any}>
                    <Patients />
                  </AuthGuard>
                }
              />

              <Route
                path="/doctors"
                element={
                  <AuthGuard requiredRole={['ADMIN'] as any}>
                    <Doctors />
                  </AuthGuard>
                }
              />

              <Route
                path="/medical-file/:patientId"
                element={
                  <AuthGuard>
                    <PatientMedicalFilePage />
                  </AuthGuard>
                }
              />

              <Route path="/unauthorized" element={
                <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
                  <h3 className="text-lg font-bold text-rose-600 mb-2">Access Denied</h3>
                  <p className="text-slate-500 text-sm font-semibold">You do not have the required permissions to view this resource.</p>
                  <Link to="/" className="inline-block mt-4 text-sm font-bold text-sky-600 hover:text-sky-700">Go to Dashboard</Link>
                </div>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
