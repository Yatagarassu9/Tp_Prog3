import { useState } from "react";
import timeSlots from "../../data/timeSlots";
import { updateAppointmentService } from "../../services/appointments.services";

// modal compartido para modificar la fecha y horario de un turno
// lo usan el cliente, el barber y el superadmin
// recibe el turno a editar, una funcion para cerrar y una para cuando se guardo bien
function AppointmentEditModal({ appointment, onClose, onSaved }) {
  // cargamos la fecha actual del turno para mostrarsela al usuario
  const existingDate = new Date(appointment.appointmentDate);

  // usamos fecha local (no UTC) para que el input date muestre el dia correcto
  // toISOString() devuelve UTC y puede mostrar un dia anterior en zonas UTC-
  const localDateStr = (() => {
    const y = existingDate.getFullYear();
    const m = String(existingDate.getMonth() + 1).padStart(2, "0");
    const d = String(existingDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  const [newDate, setNewDate] = useState(localDateStr);

  // buscamos el slot que coincide con la hora actual del turno para pre-seleccionarlo en el dropdown
  const existingHours = existingDate.getHours().toString().padStart(2, "0");
  const existingMinutes = existingDate.getMinutes().toString().padStart(2, "0");
  const existingTimeStr = `${existingHours}:${existingMinutes}`;
  const matchedSlot = timeSlots.find((s) => s.time === existingTimeStr);

  // arrancamos con el slot del turno actual pre-seleccionado, o vacio si no matchea
  const [newTime, setNewTime] = useState(
    matchedSlot ? matchedSlot.id.toString() : "",
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    // validamos que haya elegido fecha Y horario antes de llamar al servidor
    if (!newDate || !newTime) {
      setError("Seleccioná fecha y horario.");
      return;
    }

    // buscamos el objeto slot para obtener la hora en formato HH:MM
    const slot = timeSlots.find((s) => s.id === Number(newTime));
    if (!slot) return;

    // combinamos la fecha elegida con la hora del slot para armar el Date completo
    // parseamos la fecha como local (no UTC) para evitar que setHours cambie el dia
    const [h, m] = slot.time.split(":");
    const [yr, mo, dy] = newDate.split("-").map(Number);
    const combined = new Date(yr, mo - 1, dy);
    combined.setHours(Number(h), Number(m), 0, 0);

    // no dejamos modificar a una fecha que ya paso
    if (combined <= new Date()) {
      setError("La fecha debe ser futura.");
      return;
    }

    setError("");
    setLoading(true);

    // llamamos al servicio que hace el PUT al backend con la nueva fecha
    updateAppointmentService(
      appointment.id,
      combined.toISOString(),
      () => {
        setLoading(false);
        // avisamos al padre que se guardo pasandole el id y la nueva fecha
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

        {/* info del turno para que el usuario sepa cual esta editando */}
        <div className="modal-row">
          <span className="modal-label">Cliente</span>
          <span>
            {appointment.client?.name || appointment.barber?.name || "—"}
          </span>
        </div>
        <div className="modal-row">
          <span className="modal-label">Servicio</span>
          <span>{appointment.cut?.name || "—"}</span>
        </div>

        {/* selector de fecha, el min evita que elijan dias pasados */}
        <div className="modal-row">
          <span className="modal-label">Nueva fecha</span>
          <input
            type="date"
            value={newDate}
            min={(() => {
              const t = new Date();
              return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
            })()}
            onChange={(e) => setNewDate(e.target.value)}
            className="modal-date-input"
          />
        </div>

        {/* dropdown con los horarios disponibles segun los timeSlots */}
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

        {error && <p className="modal-error">{error}</p>}

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
