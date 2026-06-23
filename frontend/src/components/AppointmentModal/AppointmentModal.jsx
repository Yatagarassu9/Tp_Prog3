import "../../styles/appointmentModal.css";

function AppointmentModal({ appointment, onClose }) {
  if (!appointment) return null;

  const date = new Date(appointment.appointmentDate);
  const day = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Detalle del turno</h3>
        <div className="modal-row"><span className="modal-label">Día:</span><span>{day}</span></div>
        <div className="modal-row"><span className="modal-label">Horario:</span><span>{time}</span></div>
        <div className="modal-row"><span className="modal-label">Servicio:</span><span>{appointment.cut?.name || appointment.Cut?.name || "—"}</span></div>
        <div className="modal-row"><span className="modal-label">Cliente:</span><span>{appointment.client?.name}</span></div>
        <div className="modal-row"><span className="modal-label">Teléfono:</span><span>{appointment.client?.phone}</span></div>
        <button className="modal-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default AppointmentModal;
