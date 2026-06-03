import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("login");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLoginSuccess = (token) => {
    login(token);
    navigate("/");
  };

  const handleRegisterSuccess = () => {
    setView("login");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", paddingTop: "80px" }}
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
    </div>
  );
}

export default LoginPage;
