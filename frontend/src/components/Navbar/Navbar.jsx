import "../../styles/navbar.css";
import { Link, useNavigate, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path ? "navbar-link-active" : "";

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const closeAll = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-brand">
        <span className="navbar-title">Barbería Cráneo Barbero</span>
      </div>

      <button
        className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menú"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
        {/* Acá se ve si no hay usuario o cliente logueado. Si no inició sesion se muestra la navbar común */}
        {(!user || user.role === "client") && (
          <>
            <Link to="/appointment" className="navbar-cta">
              Sacar turno
            </Link>
            <Link to="/">Inicio</Link>
            <Link to="/about">Nosotros</Link>
          </>
        )}

        {/* Se ve si el usuario logueado es barbero */}
        {user?.role === "barber" && (
          <>
            <Link to="/barber" className={isActive("/barber")}>
              Inicio
            </Link>
            <Link
              to="/barber/schedule"
              className={isActive("/barber/schedule")}
            >
              Mi agenda
            </Link>
          </>
        )}

        {/* Se ve si el usuario logueado es admin */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" className={isActive("/admin")}>
              Inicio
            </Link>
            <Link to="/admin/manage" className={isActive("/admin/manage")}>
              Gestionar
            </Link>
          </>
        )}

        {/* Sección de autenticación, cambia segun quien sea */}
        {user?.role === "barber" ? (
          <div className="navbar-barber-session">
            <span className="navbar-barber-name">{user.name}</span>
            <button className="navbar-barber-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : user?.role === "admin" ? (
          // dropdown de mi cuenta para el admin
          <div className="navbar-account" ref={dropdownRef}>
            <button
              className="navbar-account-btn"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              Mi Cuenta{" "}
              <span className="navbar-chevron">{dropdownOpen ? "▴" : "▾"}</span>
            </button>
            {dropdownOpen && (
              <div className="navbar-dropdown">
                <Link to="/my-account/change-password" onClick={closeAll}>
                  Cambiar contraseña
                </Link>
                <button
                  className="navbar-dropdown-logout"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : user ? (
          <div className="navbar-account" ref={dropdownRef}>
            <button
              className="navbar-account-btn"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              Mi Cuenta{" "}
              <span className="navbar-chevron">{dropdownOpen ? "▴" : "▾"}</span>
            </button>
            {dropdownOpen && ( // si dropdownOpen = true, despliega el menu
              <div className="navbar-dropdown">
                <Link to="/my-account/appointments" onClick={closeAll}>
                  Mis turnos
                </Link>

                <button
                  className="navbar-dropdown-logout"
                  onClick={handleLogout}
                >
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
