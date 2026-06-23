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
    user?.role !== "admin" &&
    user?.role !== "barber" &&
    location.pathname !== "/appointment";

  return (
    <div className="layout page-transition">
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
      {user?.role !== "barber" && user?.role !== "admin" && <Footer />}
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
