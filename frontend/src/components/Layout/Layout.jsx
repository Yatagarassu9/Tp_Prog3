import "../../styles/layout.css";
import { useLocation, useNavigate, Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext";

function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const showFab =
    !location.pathname.startsWith("/barber") &&
    location.pathname !== "/appointment";
  // oculta el boton flotante en rutas del barbero y en la pagina de sacar turno
  // el startswith hace que las rutas que empiezan con /barber, no tengan el boton flotante

  return (
    <div className="layout page-transition">
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
      {user?.role !== "barber" && <Footer />}
      {showFab && (
        <button
          className="fab-appointment"
          onClick={() => navigate("/appointment")}
          title="Sacar turno"
          aria-label="Sacar turno"
        >
          <span className="fab-label">Sacar turno</span>
          <i className="ti ti-scissors" />
        </button>
      )}
    </div>
  );
}

export default Layout;
