import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBarberAppointmentsService } from "./barber.services";
import { cancelAppointmentService } from "../../services/appointments.services";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";
import AppointmentEditModal from "../../components/AppointmentEditModal/AppointmentEditModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "../../styles/barberDashboard.css";
import "../../styles/appointmentModal.css";

function BarberDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const handleConfirmCancel = () => {
    cancelAppointmentService(
      cancelingId,
      () => {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === cancelingId ? { ...a, status: "cancelled" } : a,
          ),
        );
        setCancelingId(null);
      },
      () => setCancelingId(null),
    );
  };

  useEffect(() => {
    document.title = " Inicio | Cráneo Barbero";
  }, []);

  // cargamos el array con los appointments
  useEffect(() => {
    getBarberAppointmentsService(
      (data) => setAppointments(data),
      () => setAppointments([]),
    );
  }, []);

  const now = new Date();
  const today = now.toDateString(); // convierte la fecha en String sin hora, asi puedo comparar solo el día sin la hora

  const todayAppointments = appointments.filter(
    // filtro solamente los de ese dia
    (appointment) =>
      new Date(appointment.appointmentDate).toDateString() === today,
  );

  // comparo con el status de los turnos
  const attended = todayAppointments.filter(
    (appointment) => appointment.status === "completed",
  );
  const pending = todayAppointments.filter(
    (appointment) => appointment.status === "pending",
  );

  const upcoming = appointments
    .filter(
      (appointment) =>
        new Date(appointment.appointmentDate) > now &&
        appointment.status === "pending",
    ) // filtro del más próximo al más lejano
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const nextAppointment = upcoming[0] || null; // si upcoming está vacío o es undefined, el badge del próximo turno no aparece porque no tiene ninguno

  const minutesUntilNext = nextAppointment
    ? Math.round((new Date(nextAppointment.appointmentDate) - now) / 60000)
    : null;

  const futureDays = [
    // Set elimina fechas duplicadas (si hay 2 turnos el mismo día, aparece una sola vez)
    ...new Set(
      appointments
        // solo los turnos desde hoy en adelante
        .filter(
          (appointment) =>
            new Date(appointment.appointmentDate) >= new Date(today),
        )
        // convertimos cada fecha a string de solo día, sin hora
        .map((appointment) =>
          new Date(appointment.appointmentDate).toDateString(),
        ),
    ),
  ]
    // ordenamos los días de más cercano a más lejano
    .sort((a, b) => new Date(a) - new Date(b))
    // volvemos a convertir a objeto Date para poder usarlo después
    .map((dateStr) => new Date(dateStr));

  // si hoy no tiene turnos, lo agregamos igual al principio
  if (!futureDays.some((d) => d.toDateString() === today)) {
    futureDays.unshift(new Date(now));
  }

  const appointmentsForDay = (day) =>
    appointments
      .filter(
        (appointment) =>
          new Date(appointment.appointmentDate).toDateString() ===
            day.toDateString() && appointment.status !== "cancelled",
      )
      .sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
      );

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const isPast = (date) => new Date(date) < now;

  const formatDayTitle = (date) =>
    date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="barber-dashboard page-transition">
      {/* Stats */}
      <section className="barber-stats">
        <div className="stat-card">
          <span className="stat-value">{todayAppointments.length}</span>
          <span className="stat-label">Turnos de hoy</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{pending.length}</span>
          <span className="stat-label">Por atender</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{attended.length}</span>
          <span className="stat-label">Ya atendidos</span>
        </div>
      </section>

      {/* Próximo turno */}
      <section className="barber-next">
        <h2 className="section-title">Próximo turno</h2>
        {nextAppointment ? (
          <div className="next-card">
            <div className="next-time">
              {formatTime(nextAppointment.appointmentDate)}
            </div>
            <div className="next-info">
              <span className="next-client">
                {nextAppointment.client?.name}
              </span>
              <span className="next-service">{nextAppointment.Cut?.name}</span>
            </div>
            <div className="next-badge">En {minutesUntilNext} min</div>
          </div>
        ) : (
          <p className="no-appointments">No hay turnos próximos.</p>
        )}
      </section>

      {/* Agenda de la semana */}
      <section className="barber-agenda">
        <h2 className="section-title">Agenda de la semana</h2>
        {futureDays.map((day) => {
          const dayAppointments = appointmentsForDay(day);
          return (
            <div key={day.toDateString()} className="agenda-day">
              <div className="agenda-day-title">
                <span>{formatDayTitle(day)}</span>
                <div className="agenda-day-line" />
              </div>
              {dayAppointments.length === 0 ? (
                <p className="no-appointments-day">
                  Todavía no hay turnos solicitados.
                </p>
              ) : (
                dayAppointments.map((appointment) => {
                  const isNext = nextAppointment?.id === appointment.id;
                  const isPassedAppointment =
                    day.toDateString() === now.toDateString() &&
                    isPast(appointment.appointmentDate);
                  return (
                    <div
                      key={appointment.id}
                      className={`agenda-row ${isNext ? "agenda-row-next" : ""} ${isPassedAppointment ? "agenda-row-past" : ""}`}
                    >
                      <span className="agenda-time">
                        {formatTime(appointment.appointmentDate)}
                      </span>
                      <span
                        className="agenda-client"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        {appointment.client?.name}
                      </span>

                      <span className="agenda-service">
                        {appointment.cut?.name}
                      </span>
                      <div className="agenda-actions">
                        {!isPassedAppointment && (
                          <>
                            <button
                              className="btn-agenda-edit"
                              onClick={() => setEditingAppointment(appointment)}
                            >
                              Modificar
                            </button>
                            <button
                              className="btn-agenda-cancel"
                              onClick={() => setCancelingId(appointment.id)}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </section>
      <AppointmentModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSaved={(updatedId, newDate) => {
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === updatedId ? { ...a, appointmentDate: newDate } : a,
              ),
            );
            setEditingAppointment(null);
          }}
        />
      )}

      {cancelingId && (
        <ConfirmModal
          title="Cancelar turno"
          message="¿Estás seguro que querés cancelar este turno? El cliente podrá volver a sacarlo."
          confirmLabel="Sí, cancelar"
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelingId(null)}
        />
      )}
    </div>
  );
}

export default BarberDashboardPage;
