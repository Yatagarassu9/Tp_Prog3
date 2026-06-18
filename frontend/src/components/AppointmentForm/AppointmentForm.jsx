import { useState } from "react";
import timeSlots from "../../data/timeSlots";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { useAuth } from "../../context/AuthContext";
import { createAppointmentService } from "./appointment.services";

function AppointmentForm({
  branch,
  barber,
  day,
  hours,
  cut,
  branches,
  barbers,
  cuts,
  timeSlots,
}) {
  const { user, login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("login");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const selectedBranch = branches.find((b) => b.id === branch);
  const selectedBarber = barbers.find((barb) => barb.id === barber);
  const selectedHour = timeSlots.find((hour) => hour.id === hours);
  const selectedCut = cuts.find((c) => c.id === cut);

  const handleConfirm = () => {
    if (!user) { openModal(); return; }
    const slot = timeSlots.find((s) => s.id === hours);
    if (!slot) return;
    const [h, m] = slot.time.split(":");
    const date = new Date(day);
    date.setHours(Number(h), Number(m), 0, 0);
    setConfirmError("");
    setConfirmLoading(true);
    createAppointmentService(
      user.id,
      barber,
      date.toISOString(),
      cut,
      () => { setConfirmLoading(false); setConfirmed(true); },
      (err) => { setConfirmLoading(false); setConfirmError(err.message); }
    );
  };

  const openModal = () => {
    setView("login");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Login usa onCancel("register") para pedir cambio de vista
  const handleLoginCancel = (action) => {
    if (action === "register") {
      setView("register");
    } else {
      closeModal();
    }
  };

  const handleLoginSuccess = (token) => {
    login(token);
    closeModal();
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const slot = timeSlots.find((s) => s.id === hours);
    if (!slot) return;
    const [h, m] = slot.time.split(":");
    const date = new Date(day);
    date.setHours(Number(h), Number(m), 0, 0);
    setConfirmError("");
    setConfirmLoading(true);
    createAppointmentService(
      decoded.id,
      barber,
      date.toISOString(),
      cut,
      () => { setConfirmLoading(false); setConfirmed(true); },
      (err) => { setConfirmLoading(false); setConfirmError(err.message); }
    );
  };

  const handleRegisterSuccess = () => {
    // Tras registrarse, vuelve al login para iniciar sesión
    setView("login");
  };

  return (
    <>
      <div className="card bg-dark border-warning mt-4 p-4">
        <h5 className="text-warning mb-3">Turno elegido:</h5>
        <div className="text-light mb-1">Sucursal: {selectedBranch.name}</div>
        <div className="text-light mb-1">Barbero: {selectedBarber.name}</div>
        <div className="text-light mb-1">
          Fecha: {day.toLocaleDateString("es-AR")}
        </div>
        <div className="text-light mb-1">Horario: {selectedHour.time}</div>
        <div className="text-light mb-1">
          Servicio: {selectedCut.name} — {selectedCut.price}
        </div>

        {confirmError && (
          <div className="alert alert-danger py-2 mt-3" style={{ fontSize: "0.85rem" }}>
            {confirmError}
          </div>
        )}

        {confirmed ? (
          <div className="btn btn-success text-white mt-3 w-100 disabled">
            ¡Turno confirmado!
          </div>
        ) : (
          <button
            className="btn btn-warning text-dark mt-3 w-100"
            onClick={handleConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? "Confirmando..." : "Confirmar Turno"}
          </button>
        )}
      </div>

      {showModal && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content bg-dark border-warning">
                <div className="modal-header border-warning">
                  <h5 className="modal-title text-warning">
                    {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  {view === "login" ? (
                    <Login
                      onLogin={handleLoginSuccess}
                      onCancel={handleLoginCancel}
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
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}

export default AppointmentForm;
