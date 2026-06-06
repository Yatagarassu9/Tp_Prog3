import "./App.css";
import AppointmentPage from "./pages/public/AppointmentPage";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import AboutPage from "./pages/public/AboutPage";
import BarberDashboardPage from "./pages/barber/BarberDashboardPage";
import BarberSchedulePage from "./pages/barber/BarberSchedulePage";
import MyAppointmentsPage from "./pages/client/MyAppointmentsPage";
import ChangePasswordPage from "./pages/client/ChangePasswordPage";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas del barbero */}
          <Route path="/barber">
            <Route index element={<BarberDashboardPage />} />
            <Route path="schedule" element={<BarberSchedulePage />} />
          </Route>

          {/* Rutas del cliente */}
          <Route path="/my-account">
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
