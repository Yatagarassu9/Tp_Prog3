import { useState, useEffect } from "react";
import timeSlots from "../../data/timeSlots";
import { updateAppointmentService } from "../../services/appointments.services";
import { getBookedSlotsService } from "../AppointmentForm/appointment.services";

function AppointmentEditModal({ appointment, onClose, onSaved }) {
  const existingDate = new Date(appointment.appointmentDate);

  const [newDate, setNewDate] = useState(existingDate.toISOString().slice(0, 10));

  const existingHours = existingDate.getHours().toString().padStart(2, "0");
  const existingMinutes = existingDate.getMinutes().toString().padStart(2, "0");
  const existingTimeStr = `${existingHours}:${existingMinutes}`;
  const matchedSlot = timeSlots.find((s) => s.time === existingTimeStr);

  const [newTime, setNewTime] = useState(matchedSlot ? matchedSlot.id.toString() : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);

  // trae los horarios ocupados cada vez que cambia la fecha
  useEffect(() => {
    if (!newDate || !appointment.barberId) return;
    const day = new Date(newDate + "T00:00:00").getDay();
    if (day === 0 || day === 1) { setBookedTimes([]); return; }
    getBookedSlotsService(appointment.barberId, newDate)
      .then((slots) => setBookedTimes(Array.isArray(slots) ? slots : []))
      .catch(() => setBookedTimes([]));
  }, [newDate, appointment.barberId]);

  const handleDateChange = (e) => {
    setNewDate(e.target.value);
    setNewTime("");
    setError("");
  };

  const handleSave = () => {
    if (!newDate || !newTime) {
      setError("Seleccioná fecha y horario.");
      return;
    }

    const day = new Date(newDate + "T00:00:00").getDay();
    if (day === 0 || day === 1) {
      setError("La barbería no trabaja el domingo ni el lunes. Elegí otro día.");
      return;
    }

    const slot = timeSlots.find((s) => s.id === Number(newTime));
    if (!slot) return;

    if (bookedTimes.includes(slot.time)) {
      setError("Ese horario ya está reservado. Elegí otro.");
      return;
    }

    const [h, m] = slot.time.split(":");
    const combined = new Date(newDate + "T00:00:00");
    combined.setHours(Number(h), Number(m), 0, 0);

    if (combined <= new Date()) {
      setError("La fecha debe ser futura.");
      return;
    }

    setError("");
    setLoading(true);

    updateAppointmentService(
      appointment.id,
      combined.toISOString(),
      () => {
        setLoading(false);
        onSaved(appointment.id, combined.toISOString());
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      },
    );
  };

  const selectedDayIndex = newDate ? new Date(newDate + "T00:00:00").getDay() : null;
  const isClosedDay = selectedDayIndex === 0 || selectedDayIndex === 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h3 className="modal-title">Modificar turno</h3>

        <div className="modal-row">
          <span className="modal-label">Cliente</span>
          <span>{appointment.client?.name || appointment.barber?.name || "—"}</span>
        </div>
        <div className="modal-row">
          <span className="modal-label">Servicio</span>
          <span>{appointment.Cut?.name || "—"}</span>
        </div>

        <div className="modal-row">
          <span className="modal-label">Nueva fecha</span>
          <input
            type="date"
            value={newDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={handleDateChange}
            className="modal-date-input"
          />
        </div>

        {isClosedDay && (
          <p className="modal-error">
            La barbería no trabaja el domingo ni el lunes. Elegí otro día.
          </p>
        )}

        {!isClosedDay && (
          <div className="modal-row">
            <span className="modal-label">Nuevo horario</span>
            <select
              value={newTime}
              onChange={(e) => { setNewTime(e.target.value); setError(""); }}
              className="modal-date-input"
            >
              <option value="">Elegí un horario</option>
              {timeSlots.map((slot) => {
                const isBooked = bookedTimes.includes(slot.time);
                return (
                  <option key={slot.id} value={slot.id} disabled={isBooked}>
                    {slot.time}{isBooked ? " — Ocupado" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button
            className="btn-agenda-edit"
            onClick={handleSave}
            disabled={loading || isClosedDay}
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
