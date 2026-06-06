import { useState, useEffect } from "react";
import { getBarberAppointmentsService } from "./barber.services";
import Layout from "../../components/Layout/Layout";
import "../../styles/barberDashboard.css";
import "../../styles/barberSchedule.css";

function BarberSchedulePage() {
  const [appointments, setAppointments] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
  document.title = " Mi agenda | Cráneo Barbero";
}, []);

  useEffect(() => {
    getBarberAppointmentsService(
      (data) => setAppointments(data),
      () => setAppointments([]),
    );
  }, []);

  const now = new Date();

  const getWeekStart = (offset) => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff + offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const isCurrentWeek = weekOffset === 0;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const weekAppointments = appointments.filter((appointment) => {
    const date = new Date(appointment.appointmentDate);
    return (
      date >= weekStart && date <= weekEnd && appointment.status !== "cancelled"
    );
  });

  const weekPending = weekAppointments.filter(
    (appointment) =>
      appointment.status === "pending" || appointment.status === "confirmed",
  );
  const weekAttended = weekAppointments.filter(
    (appointment) => appointment.status === "completed",
  );

  const nextAppointment = isCurrentWeek
    ? appointments
        .filter(
          (appointment) =>
            new Date(appointment.appointmentDate) > now &&
            (appointment.status === "pending" ||
              appointment.status === "confirmed"),
        )
        .sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
        )[0] || null
    : null;

  const appointmentsForDay = (day) =>
    weekAppointments
      .filter(
        (appointment) =>
          new Date(appointment.appointmentDate).toDateString() ===
          day.toDateString(),
      )
      .sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
      );

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDayTitle = (date) =>
    date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const formatShortDate = (date) =>
    date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  const isPast = (date) => new Date(date) < now;

  const weekLabel = `${formatShortDate(weekStart)} — ${formatShortDate(weekEnd)}`;

  return (
    <Layout>
      <div className="barber-dashboard">
        {/* Selector de semana */}
        <section className="week-selector">
          <button
            className="week-arrow"
            onClick={() => setWeekOffset((o) => o - 1)}
          >
            <i className="ti ti-chevron-left" />
          </button>
          <span className="week-label">{weekLabel}</span>
          <button
            className="week-arrow"
            onClick={() => setWeekOffset((o) => o + 1)}
          >
            <i className="ti ti-chevron-right" />
          </button>
        </section>

        {/* Stats: 3 si es semana actual, 1 si es otra */}
        {isCurrentWeek ? (
          <section className="barber-stats">
            <div className="stat-card">
              <span className="stat-value">{weekAppointments.length}</span>
              <span className="stat-label">Turnos esta semana</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{weekPending.length}</span>
              <span className="stat-label">Por atender</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{weekAttended.length}</span>
              <span className="stat-label">Ya atendidos</span>
            </div>
          </section>
        ) : (
          <section className="barber-stats">
            <div className="stat-card stat-card-single">
              <span className="stat-value">{weekAppointments.length}</span>
              <span className="stat-label">Turnos esta semana</span>
            </div>
          </section>
        )}

        {/* Agenda agrupada por día */}
        <section className="barber-agenda">
          {weekDays.map((day) => {
            const dayAppointments = appointmentsForDay(day);
            const isPastDay =
              day.toDateString() !== now.toDateString() && isPast(day);
            const isToday = day.toDateString() === now.toDateString();

            return (
              <div
                key={day.toDateString()}
                className={`agenda-day ${isPastDay ? "agenda-day-past" : ""}`} // usamos el css para tachar los dias
              >
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
                    const isNext =
                      isCurrentWeek && nextAppointment?.id === appointment.id;
                    const isPassedAppointment =
                      isToday && isPast(appointment.appointmentDate);
                    return (
                      <div
                        key={appointment.id}
                        className={`agenda-row ${isNext ? "agenda-row-next" : ""} ${isPassedAppointment ? "agenda-row-past" : ""}`}
                      >
                        <span className="agenda-time">
                          {formatTime(appointment.appointmentDate)}
                        </span>
                        <span className="agenda-client">
                          {appointment.client?.name}
                        </span>
                        <span className="agenda-service">
                          {appointment.Cut?.name}
                        </span>
                        <div className="agenda-actions">
                          {!isPassedAppointment && !isPastDay && (
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
      </div>
    </Layout>
  );
}

export default BarberSchedulePage;
