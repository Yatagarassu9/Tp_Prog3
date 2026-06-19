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

  useEffect(() => {
    if (user) navigate(user.role === "barber" ? "/barber" : "/");
  }, [user, navigate]);

  const handleLoginSuccess = (token) => {
    login(token); // guarda en contexto y localStorage
    const decoded = JSON.parse(atob(token.split(".")[1])); // lee el rol del token directamente
    navigate(decoded.role === "barber" ? "/barber" : "/"); // navega según el rol
  }; // Decodifica el token JWT para leer el payload (los datos del usuario) en ese momento, porque el AuthContext acaba de actualizar su estado
  // pero React todavía no lo refleja. Cuando trae los datos y el rol, navega a la ruta correspondiente

  const handleRegisterSuccess = (token) => {
    login(token);
    const decoded = JSON.parse(atob(token.split(".")[1]));
    navigate(decoded.role === "barber" ? "/barber" : "/");
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
