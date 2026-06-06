import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginService } from "./auth.services";

const Login = ({ onLogin, onCancel, context }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrors({ ...error, email: false });
    setServerError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrors({ ...error, password: false });
    setServerError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setErrors({ ...error, email: true });
      emailRef.current.focus();
      return;
    }
    if (password.length < 7) {
      setErrors({ ...error, password: true });
      passwordRef.current.focus();
      return;
    }

    setLoading(true);
    loginService(
      email,
      password,
      ({ token }) => {
        localStorage.setItem("barberia-token", token);
        setLoading(false);
        onLogin(token);
      },
      (err) => {
        setServerError(err.message);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    document.title = " Iniciar sesión | Cráneo Barbero";
  }, []);

  return (
    <form onSubmit={handleLogin}>
      <p className="text-warning mb-4">Iniciá sesión para confirmar tu turno</p>

      <div className="mb-3">
        <input
          type="email"
          required
          ref={emailRef}
          placeholder="Ingresar email"
          onChange={handleEmailChange}
          value={email}
          className={`form-control bg-secondary text-white border-${error.email ? "danger" : "secondary"}`}
        />
        {error.email && (
          <p
            className="text-danger"
            style={{ fontSize: "13px", marginTop: "4px" }}
          >
            Por favor ingresá tu email.
          </p>
        )}
      </div>

      <div className="mb-4">
        <input
          type="password"
          required
          ref={passwordRef}
          placeholder="Ingresar contraseña"
          onChange={handlePasswordChange}
          value={password}
          className={`form-control bg-secondary text-white border-${error.password ? "danger" : "secondary"}`}
        />
        {error.password && (
          <p
            className="text-danger"
            style={{ fontSize: "13px", marginTop: "4px" }}
          >
            La contraseña debe tener al menos 7 caracteres.
          </p>
        )}
      </div>

      {serverError && (
        <p
          className="text-danger text-center mb-3"
          style={{ fontSize: "14px" }}
        >
          {serverError}
        </p>
      )}

      <div className="d-flex gap-2 mb-3">
        {context === "modal" && (
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onCancel}
            disabled={loading}
          >
            Cerrar
          </button>
        )}
        {context === "navbar" && (
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate(-1)} // es lo mismo que el boton que va atras en el navegador
            disabled={loading}
          >
            Volver
          </button>
        )}

        <button
          type="submit"
          className="btn btn-warning text-dark w-100"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </div>

      <hr className="border-secondary" />
      <p
        className="text-center text-secondary mb-2"
        style={{ fontSize: "14px" }}
      >
        ¿No tenés cuenta?
      </p>
      <button
        type="button"
        className="btn btn-outline-warning w-100"
        onClick={() => onCancel("register")}
        disabled={loading}
      >
        Crear cuenta nueva
      </button>
    </form>
  );
};

export default Login;
