import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBarberAppointmentsService } from "./barber.services";
import { cancelAppointmentService } from "../../services/appointments.services";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";
import AppointmentEditModal from "../../components/AppointmentEditModal/AppointmentEditModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "../../styles/barberDashboard.css";
import "../../styles/appointmentModal.css";

// pagina principal del barbero, muestra su agenda y estadisticas del dia
function BarberDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // para el modal de detalle
  const [editingAppointment, setEditingAppointment] = useState(null);   // para el modal de editar
  const [cancelingId, setCancelingId] = useState(null);                  // id del turno a cancelar

  // cuando confirma la cancelacion en el modal hacemos el request y actualizamos el estado local
  const handleConfirmCancel = () => {
    cancelAppointmentService(
      cancelingId,
      () => {
        // actualizamos solo el turno cancelado sin recargar toda la lista
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

  // cargamos los turnos del barbero al montar el componente
  useEffect(() => {
    getBarberAppointmentsService(
      (data) => setAppointments(data),
      () => setAppointments([]),
    );
  }, []);

  const now = new Date();
  const today = now.toDateString(); // convertimos a string sin hora para comparar solo el dia

  // filtramos los turnos que son de hoy
  const todayAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.appointmentDate).toDateString() === today &&
      appointment.status !== "cancelled",
  );

  // cuantos turnos de hoy ya estan completados
  const attended = todayAppointments.filter(
    (appointment) => appointment.status === "completed",
  );

  // cuantos turnos de hoy estan pendientes de atender
  const pending = todayAppointments.filter(
    (appointment) => appointment.status === "pending",
  );

  // lista de turnos futuros ordenados del mas proximo al mas lejano
  // sirve para mostrar el "proximo turno" en el banner principal
  const upcoming = appointments
    .filter(
      (appointment) =>
        new Date(appointment.appointmentDate) > now &&
        appointment.status === "pending",
    )
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  // el proximo turno es el primero de la lista de futuros, o null si no hay
  const nextAppointment = upcoming[0] || null;

  // cuantos minutos faltan para el proximo turno
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
    ...new Set(
      appointments
        .filter(
          (appointment) =>
            new Date(appointment.appointmentDate) >= new Date(today),
        )
        .map((appointment) =>
          new Date(appointment.appointmentDate).toDateString(),
        ),
    ),
  ]
    .sort((a, b) => new Date(a) - new Date(b))
    .map((dateStr) => new Date(dateStr));

  // si hoy no tiene turnos lo agregamos igual para mostrar el dia vacio
  if (!futureDays.some((d) => d.toDateString() === today)) {
    futureDays.unshift(new Date(now));
  }

  // devuelve los turnos no cancelados de un dia especifico, ordenados por hora
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

  // formatea una fecha a solo hora HH:MM en formato 24h
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // devuelve true si la fecha ya paso respecto a ahora
  const isPast = (date) => new Date(date) < now;

  // formatea un dia para el titulo de la agenda (ej: "lunes 12 de junio")
  const formatDayTitle = (date) =>
    date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="barber-dashboard page-transition">
      {/* tarjetas con los numeros del dia: total, pendientes y ya atendidos */}
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

      {/* banner con el proximo turno, muestra hora, cliente y tiempo restante */}
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
              <span className="next-service">{nextAppointment.cut?.name}</span>
            </div>
            <div className="next-badge">{formatTimeUntil(minutesUntilNext)}</div>
          </div>
        ) : (
          <p className="no-appointments">No hay turnos próximos.</p>
        )}
      </section>

      {/* agenda con todos los dias que tienen turnos, uno por fila */}
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
                  // marcamos el proximo turno con una clase especial para resaltarlo
                  const isNext = nextAppointment?.id === appointment.id;
                  // si el turno es de hoy y ya paso la hora lo marcamos como pasado
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
                      {/* click en el nombre del cliente abre el modal de detalle */}
                      <span
                        className="agenda-client"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        {appointment.client?.name}
                      </span>

                      <span className="agenda-service">
                        {appointment.cut?.name}
                      </span>

                      {/* los botones de modificar y cancelar solo aparecen si el turno no paso */}
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

      {/* modal que muestra el detalle de un turno al hacer click en el cliente */}
      <AppointmentModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* modal para cambiar la fecha y hora de un turno */}
      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSaved={(updatedId, newDate) => {
            // actualizamos solo la fecha del turno editado en el estado local
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === updatedId ? { ...a, appointmentDate: newDate } : a,
              ),
            );
            setEditingAppointment(null);
          }}
        />
      )}

      {/* modal de confirmacion antes de cancelar un turno */}
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
