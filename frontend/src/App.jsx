import "./App.css";
import AppointmentPage from "./pages/AppointmentPage";
import BarberDashboardPage from "./pages/BarberDashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CambiarContrasenaPage from "./pages/CambiarContrasenaPage";
import MisTurnosPage from "./pages/MisTurnosPage";
import NosotrosPage from "./pages/NosotrosPage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";

function ScrollToTop() {//cada vez que cambiamos de pagina(ruta) nos manda arriba de la pagina
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
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/barber" element={<BarberDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mi-cuenta/cambiar-contrasena" element={<CambiarContrasenaPage />} />
          <Route path="/mi-cuenta/mis-turnos" element={<MisTurnosPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
