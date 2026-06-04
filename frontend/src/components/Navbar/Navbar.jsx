import "../../styles/navbar.css";
import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav className="custom-navbar">
      <div className="navbar-brand">
        <span className="navbar-title">Barbería Cráneo Barbero</span>
      </div>
      <div className="navbar-links">
        <Link to="/appointment" className="navbar-cta">
          Sacar turno
        </Link>
        <Link to="/">Inicio</Link>
        <Link to="/nosotros">Nosotros</Link>

        {user ? (
          <div className="navbar-account" ref={dropdownRef}>
            <button
              className="navbar-account-btn"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              Mi Cuenta <span className="navbar-chevron">{dropdownOpen ? "▴" : "▾"}</span>
            </button>
            {dropdownOpen && (
              <div className="navbar-dropdown">
                <Link to="/mi-cuenta/mis-turnos" onClick={closeDropdown}>
                  Modificar turno
                </Link>
                <button className="navbar-dropdown-logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
