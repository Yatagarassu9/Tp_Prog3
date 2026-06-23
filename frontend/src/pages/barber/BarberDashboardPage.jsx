import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBarberAppointmentsService } from "./barber.services";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";
import "../../styles/barberDashboard.css";
import "../../styles/appointmentModal.css";

function BarberDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    (appointment) =>
      new Date(appointment.appointmentDate).toDateString() === today &&
      appointment.status !== "cancelled",
  );

  // comparo con el status de los turnos
  const attended = todayAppointments.filter(
    (appointment) => appointment.status === "completed",
  );
  const pending = todayAppointments.filter(
    (appointment) =>
      appointment.status === "pending" || appointment.status === "confirmed",
  );

  const upcoming = appointments
    .filter(
      // filtro los futuros turnos
      (appointment) =>
        new Date(appointment.appointmentDate) > now &&
        (appointment.status === "pending" ||
          appointment.status === "confirmed"),
    ) // filtro del más próximo al más lejano
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const nextAppointment = upcoming[0] || null; // si upcoming está vacío o es undefined, el badge del próximo turno no aparece porque no tiene ninguno

  const minutesUntilNext = nextAppointment
    ? Math.round((new Date(nextAppointment.appointmentDate) - now) / 60000)
    : null;

  const formatTimeUntil = (minutes) => {
    if (minutes <= 0) return "ahora";
    if (minutes < 60) return `En ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `En ${hours} h`;
    const days = Math.round(hours / 24);
    return `En ${days} día${days !== 1 ? "s" : ""}`;
  };

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
            <div className="next-badge">{formatTimeUntil(minutesUntilNext)}</div>
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
                        {appointment.Cut?.name}
                      </span>
                      <div className="agenda-actions">
                        {!isPassedAppointment && (
                          <>
                            <button className="btn-agenda-edit">
                              Modificar
                            </button>
                            <button className="btn-agenda-cancel">
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
    </div>
  );
}

export default BarberDashboardPage;
