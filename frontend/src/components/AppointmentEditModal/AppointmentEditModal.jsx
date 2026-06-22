import { useState } from "react";
import timeSlots from "../../data/timeSlots";
import { updateAppointmentService } from "../../services/appointments.services";

// modal compartido para modificar la fecha y horario de un turno
// lo usan el cliente, el barber y el superadmin
// recibe el turno a editar, una función para cerrar y una para cuando se guardó bien
function AppointmentEditModal({ appointment, onClose, onSaved }) {
  // cargamos la fecha actual del turno para mostrársela al usuario
  const existingDate = new Date(appointment.appointmentDate);

  // estado para la nueva fecha elegida (formato YYYY-MM-DD que pide el input date)
  const [newDate, setNewDate] = useState(existingDate.toISOString().slice(0, 10));

  // buscamos el slot que coincide con la hora actual del turno para pre-seleccionarlo
  const existingHours = existingDate.getHours().toString().padStart(2, "0");
  const existingMinutes = existingDate.getMinutes().toString().padStart(2, "0");
  const existingTimeStr = `${existingHours}:${existingMinutes}`;
  const matchedSlot = timeSlots.find((s) => s.time === existingTimeStr);

  // estado para el horario elegido, arranca con el del turno si existe
  const [newTime, setNewTime] = useState(matchedSlot ? matchedSlot.id.toString() : "");

  // para mostrar mensajes de error o éxito
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    // validamos que eligió fecha y horario antes de llamar al servidor
    if (!newDate || !newTime) {
      setError("Seleccioná fecha y horario.");
      return;
    }

    // buscamos el objeto del slot para sacar la hora en formato HH:MM
    const slot = timeSlots.find((s) => s.id === Number(newTime));
    if (!slot) return;

    // armamos el Date combinando la fecha elegida con la hora del slot
    const [h, m] = slot.time.split(":");
    const combined = new Date(newDate);
    combined.setHours(Number(h), Number(m), 0, 0);

    // no dejamos elegir una fecha que ya pasó
    if (combined <= new Date()) {
      setError("La fecha debe ser futura.");
      return;
    }

    setError("");
    setLoading(true);

    // llamamos al servicio que hace el PUT al backend
    updateAppointmentService(
      appointment.id,
      combined.toISOString(),
      () => {
        setLoading(false);
        // avisamos al padre que se guardó y le pasamos el id y la nueva fecha
        onSaved(appointment.id, combined.toISOString());
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      },
    );
  };

  return (
    // click fuera del cuadro cierra el modal
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h3 className="modal-title">Modificar turno</h3>

        {/* info del turno para que el usuario sepa cuál está editando */}
        <div className="modal-row">
          <span className="modal-label">Cliente</span>
          <span>{appointment.client?.name || appointment.barber?.name || "—"}</span>
        </div>
        <div className="modal-row">
          <span className="modal-label">Servicio</span>
          <span>{appointment.Cut?.name || "—"}</span>
        </div>

        {/* selector de fecha, no dejamos elegir días pasados */}
        <div className="modal-row">
          <span className="modal-label">Nueva fecha</span>
          <input
            type="date"
            value={newDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setNewDate(e.target.value)}
            className="modal-date-input"
          />
        </div>

        {/* selector de horario con los slots disponibles */}
        <div className="modal-row">
          <span className="modal-label">Nuevo horario</span>
          <select
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="modal-date-input"
          >
            <option value="">Elegí un horario</option>
            {timeSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.time}
              </option>
            ))}
          </select>
        </div>

        {/* mensaje de error si algo salió mal */}
        {error && <p className="modal-error">{error}</p>}

        {/* botones de guardar y cancelar */}
        <div className="modal-actions">
          <button
            className="btn-agenda-edit"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambio"}
          </button>
          <button className="modal-close" onClick={onClose}>
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}

export default AppointmentEditModal;
