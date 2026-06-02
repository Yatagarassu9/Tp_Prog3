import "../../styles/navbar.css";
import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="custom-navbar">
      <div className="navbar-brand">
        <span className="navbar-title">Barbería Cráneo Barbero</span>
      </div>
      <div className="navbar-links">
        <a href="#hero">Inicio</a>
        <a href="#branches">Sucursales</a>
        <a href="#history">Nosotros</a>
        <Link to="/appointment" className="navbar-cta">
          Sacar turno
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
