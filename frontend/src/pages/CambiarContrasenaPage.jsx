import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { changePasswordService } from "../components/auth/account.services";
import Layout from "../components/Layout/Layout";

function CambiarContrasenaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <p className="text-warning mb-3">Debés iniciar sesión para acceder a esta sección.</p>
            <button className="btn btn-warning text-dark" onClick={() => navigate("/login")}>
              Ir al login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 7) {
      setError("La contraseña debe tener al menos 7 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    changePasswordService(
      user.id,
      newPassword,
      () => {
        setLoading(false);
        setSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
  };

  return (
    <Layout>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh", paddingTop: "80px" }}
      >
        <div
          className="card bg-dark border-warning p-4"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <button
            className="btn btn-outline-secondary btn-sm mb-3"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>

          <h4 className="text-warning mb-4">Cambiar contraseña</h4>

          {success && (
            <div className="alert alert-success">
              Contraseña actualizada correctamente.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Nueva contraseña (mínimo 7 caracteres)"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(""); setSuccess(false); }}
                className="form-control bg-secondary text-white border-secondary"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Repetir nueva contraseña"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); setSuccess(false); }}
                className="form-control bg-secondary text-white border-secondary"
                required
              />
            </div>

            {error && (
              <p className="text-danger mb-3" style={{ fontSize: "14px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-warning text-dark w-100"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CambiarContrasenaPage;
