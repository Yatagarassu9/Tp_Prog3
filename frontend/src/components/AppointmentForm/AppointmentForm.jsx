import { useState } from "react";
import branches from "../../data/branches";
import barbers from "../../data/barbers";
import timeSlots from "../../data/timeSlots";
import Login from "../auth/Login";
import Register from "../auth/Register";

function AppointmentForm({ branch, barber, day, hours }) {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("login"); // "login" | "register"
  const [confirmed, setConfirmed] = useState(false);

  const selectedBranch = branches.find((b) => b.id === branch);
  const selectedBarber = barbers.find((barb) => barb.id === barber);
  const selectedHour = timeSlots.find((hour) => hour.id === hours);

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

  const handleLoginSuccess = () => {
    closeModal();
    setConfirmed(true);
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

        {confirmed ? (
          <div className="btn btn-success text-white mt-3 w-100 disabled">
            ¡Turno confirmado!
          </div>
        ) : (
          <button className="btn btn-warning text-dark mt-3 w-100" onClick={openModal}>
            Confirmar Turno
          </button>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" onClick={closeModal}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content bg-dark border-warning">
                <div className="modal-header border-warning">
                  <h5 className="modal-title text-warning">
                    {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  {view === "login" ? (
                    <Login onLogin={handleLoginSuccess} onCancel={handleLoginCancel} />
                  ) : (
                    <Register onRegister={handleRegisterSuccess} onCancel={() => setView("login")} />
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
