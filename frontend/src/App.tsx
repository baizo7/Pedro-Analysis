import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/authStore"

// Layouts
import AuthLayout from "./layouts/AuthLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Pages
import Landing from "./features/landing/Landing"
import Login from "./features/auth/Login"
import Register from "./features/auth/Register"

import Datasets from "./pages/Datasets"

import Dashboard from "./features/dashboard/Dashboard"
import Analytics from "./pages/Analytics"

import Insights from "./pages/Insights"

import Reports from "./pages/Reports"
import Billing from "./pages/Billing"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/forecasting" element={<Insights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<div className="text-2xl font-bold">Notifications</div>} />
          <Route path="/settings" element={<Billing />} />
          <Route path="/admin" element={<div className="text-2xl font-bold">Admin Panel</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
