import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import CoursesPage from './pages/CoursesPage';
import RoomsPage from './pages/RoomsPage';
import ExamSlotsPage from './pages/ExamSlotsPage';
import TimetablePage from './pages/TimetablePage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import { ToastProvider } from './context/ToastContext';
import './index.css';

function App() {
  return (
    <ToastProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <MainLayout>
                <StudentsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FacultyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CoursesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoomsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-slots"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExamSlotsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TimetablePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
