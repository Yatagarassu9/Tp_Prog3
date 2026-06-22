import "./App.css";
import AppointmentPage from "./pages/public/AppointmentPage";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import AboutPage from "./pages/public/AboutPage";
import BarberDashboardPage from "./pages/barber/BarberDashboardPage";
import BarberSchedulePage from "./pages/barber/BarberSchedulePage";
import MyAppointmentsPage from "./pages/client/MyAppointmentsPage";
import ChangePasswordPage from "./pages/client/ChangePasswordPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminManagePage from "./pages/admin/AdminManagePage";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/barber">
              <Route index element={<BarberDashboardPage />} />
              <Route path="schedule" element={<BarberSchedulePage />} />
            </Route>

            <Route path="/my-account">
              <Route path="appointments" element={<MyAppointmentsPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>

            <Route path="/admin">
              <Route index element={<AdminDashboardPage />} />
              <Route path="manage" element={<AdminManagePage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
