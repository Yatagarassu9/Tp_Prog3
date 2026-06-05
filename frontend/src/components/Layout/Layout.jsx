import "../../styles/layout.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showFab = location.pathname !== "/appointment";

  return (
    <div className="layout">
      <Navbar />
      <main className="layout-main">{children}</main>
      <Footer />
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
