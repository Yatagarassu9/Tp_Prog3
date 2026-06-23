// archivo principal de rutas de la aplicacion
// aca definimos que componente se renderiza en cada URL
import "./App.css";
import AppointmentPage from "./pages/public/AppointmentPage";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import AboutPage from "./pages/public/AboutPage";
import BarberDashboardPage from "./pages/barber/BarberDashboardPage";
import BarberSchedulePage from "./pages/barber/BarberSchedulePage";
import MyAppointmentsPage from "./pages/client/MyAppointmentsPage";
import ChangePasswordPage from "./pages/client/ChangePasswordPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminManagePage from "./pages/admin/AdminManagePage";
import NotFoundPage from "./pages/public/NotFoundPage";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// componente auxiliar que hace scroll al tope cada vez que cambia la pagina
// sin esto al navegar entre paginas te quedas en la posicion del scroll anterior
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// componente que protege rutas segun el rol del usuario
// si no esta logueado lo manda al login
// si esta logueado pero no tiene el rol correcto lo manda al inicio
// si todo esta bien renderiza el contenido (Outlet) de la ruta protegida
function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider envuelve todo para que cualquier componente pueda acceder al usuario logueado */}
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Layout es el wrapper con navbar y footer, aplica a casi todas las rutas */}
          <Route element={<Layout />}>
            {/* rutas publicas, cualquiera puede entrar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* rutas solo para barberos, si sos cliente o admin te redirige al inicio */}
            <Route element={<ProtectedRoute roles={["barber"]} />}>
              <Route path="/barber">
                <Route index element={<BarberDashboardPage />} />
                <Route path="schedule" element={<BarberSchedulePage />} />
              </Route>
            </Route>

            {/* rutas para cualquier usuario logueado sin importar el rol */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-account">
                <Route path="appointments" element={<MyAppointmentsPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
              </Route>
            </Route>

            {/* rutas solo para admin y superadmin */}
            <Route element={<ProtectedRoute roles={["admin", "superadmin"]} />}>
              <Route path="/admin">
                <Route index element={<AdminDashboardPage />} />
                <Route path="manage" element={<AdminManagePage />} />
              </Route>
            </Route>
          </Route>

          {/* si ninguna ruta coincide mostramos la pagina 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
