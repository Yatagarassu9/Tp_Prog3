import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";
import { useState } from "react";

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("login");

  const roleRedirect = (role) => {
    if (role === "barber") return "/barber";
    if (role === "admin") return "/admin";
    return "/";
  };

  useEffect(() => {
    if (user) navigate(roleRedirect(user.role));
  }, [user, navigate]);

  const handleLoginSuccess = (token) => {
    login(token);
    const decoded = JSON.parse(atob(token.split(".")[1]));
    navigate(roleRedirect(decoded.role));
  };

  const handleRegisterSuccess = (token) => {
    login(token);
    const decoded = JSON.parse(atob(token.split(".")[1]));
    navigate(roleRedirect(decoded.role));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center page-transition"
      style={{ minHeight: "80vh", paddingTop: "80px" }}
    >
      <div
        className="card bg-dark border-warning p-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h4 className="text-warning text-center mb-4">
          {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h4>
        {view === "login" ? (
          <Login
            onLogin={handleLoginSuccess}
            context="navbar"
            onCancel={(action) => {
              if (action === "register") setView("register");
            }}
          />
        ) : (
          <Register
            onRegister={handleRegisterSuccess}
            onCancel={() => setView("login")}
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;
