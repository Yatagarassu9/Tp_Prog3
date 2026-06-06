import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  getMyAppointmentsService,
  cancelAppointmentService,
  updateAppointmentService,
} from "../../components/auth/account.services";
import Layout from "../../components/Layout/Layout";
import timeSlots from "../../data/timeSlots";

const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Completado",
};

const STATUS_COLORS = {
  pending: "warning",
  confirmed: "success",
  cancelled: "secondary",
  completed: "info",
};

function MyAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState({ id: null, text: "", type: "" });

  useEffect(() => {
  document.title = " Mis turnos| Cráneo Barbero";
}, []);

  const fetchAppointments = () => {
    setLoading(true);
    setError("");
    getMyAppointmentsService(
      (data) => {
        setAppointments(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const handleCancel = (appointmentId) => {
    if (!window.confirm("¿Estás seguro que querés cancelar este turno?"))
      return;
    setActionLoading(true);
    cancelAppointmentService(
      appointmentId,
      () => {
        setActionLoading(false);
        setActionMsg({
          id: appointmentId,
          text: "Turno cancelado.",
          type: "success",
        });
        fetchAppointments();
      },
      (err) => {
        setActionLoading(false);
        setActionMsg({ id: appointmentId, text: err.message, type: "danger" });
      },
    );
  };

  const handleStartEdit = (appointment) => {
    const date = new Date(appointment.appointmentDate);
    setNewDate(date.toISOString().slice(0, 10));
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    const matchedSlot = timeSlots.find((s) => s.time === currentTime);
    setNewTime(matchedSlot ? matchedSlot.id.toString() : "");
    setEditingId(appointment.id);
    setActionMsg({ id: null, text: "", type: "" });
  };

  const handleSaveEdit = (appointmentId) => {
    if (!newDate || !newTime) {
      setActionMsg({
        id: appointmentId,
        text: "Seleccioná fecha y horario.",
        type: "danger",
      });
      return;
    }
    const slot = timeSlots.find((s) => s.id === Number(newTime));
    if (!slot) return;
    const [h, m] = slot.time.split(":");
    const combined = new Date(newDate);
    combined.setHours(Number(h), Number(m), 0, 0);

    if (combined <= new Date()) {
      setActionMsg({
        id: appointmentId,
        text: "La fecha debe ser futura.",
        type: "danger",
      });
      return;
    }

    setActionLoading(true);
    updateAppointmentService(
      appointmentId,
      combined.toISOString(),
      () => {
        setActionLoading(false);
        setEditingId(null);
        setActionMsg({
          id: appointmentId,
          text: "Turno modificado correctamente.",
          type: "success",
        });
        fetchAppointments();
      },
      (err) => {
        setActionLoading(false);
        setActionMsg({ id: appointmentId, text: err.message, type: "danger" });
      },
    );
  };

  if (!user) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <p className="text-warning mb-3">
              Debés iniciar sesión para ver tus turnos.
            </p>
            <button
              className="btn btn-warning text-dark"
              onClick={() => navigate("/login")}
            >
              Ir al login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const today = new Date();
  const activeAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed",
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "completed",
  );

  return (
    <Layout>
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "40px",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "100px 20px 40px",
        }}
      >
        <button
          className="btn btn-outline-secondary btn-sm mb-4"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <h3 className="text-warning mb-4">Mis turnos</h3>

        {loading && <p className="text-secondary">Cargando turnos...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && activeAppointments.length === 0 && (
          <div className="card bg-dark border-secondary p-4 text-center">
            <p className="text-secondary mb-3">No tenés turnos activos.</p>
            <button
              className="btn btn-warning text-dark"
              onClick={() => navigate("/appointment")}
            >
              Sacar un turno
            </button>
          </div>
        )}

        {activeAppointments.map((appointment) => {
          const date = new Date(appointment.appointmentDate);
          const isPast = date <= today;
          const isEditing = editingId === appointment.id;

          return (
            <div
              key={appointment.id}
              className="card bg-dark border-warning mb-3 p-4"
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span
                    className="text-warning fw-bold"
                    style={{ fontSize: "1rem" }}
                  >
                    {date.toLocaleDateString("es-AR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className="text-secondary ms-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {date.toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span
                  className={`badge bg-${STATUS_COLORS[appointment.status]}`}
                >
                  {STATUS_LABELS[appointment.status]}
                </span>
              </div>

              {appointment.barber && (
                <p className="text-light mb-1" style={{ fontSize: "0.9rem" }}>
                  Barbero:{" "}
                  <span className="text-white">{appointment.barber.name}</span>
                </p>
              )}

              {actionMsg.id === appointment.id && actionMsg.text && (
                <div
                  className={`alert alert-${actionMsg.type} py-2 mt-2`}
                  style={{ fontSize: "0.85rem" }}
                >
                  {actionMsg.text}
                </div>
              )}

              {!isPast && !isEditing && (
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => handleStartEdit(appointment)}
                    disabled={actionLoading}
                  >
                    Modificar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleCancel(appointment.id)}
                    disabled={actionLoading}
                  >
                    Cancelar turno
                  </button>
                </div>
              )}

              {isEditing && (
                <div className="mt-3">
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="date"
                      value={newDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="form-control bg-secondary text-white border-secondary"
                      style={{ flex: 1 }}
                    />
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="form-select bg-secondary text-white border-secondary"
                      style={{ flex: 1 }}
                    >
                      <option value="">Horario</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning text-dark btn-sm"
                      onClick={() => handleSaveEdit(appointment.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Guardando..." : "Guardar cambio"}
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setEditingId(null);
                        setActionMsg({ id: null, text: "", type: "" });
                      }}
                      disabled={actionLoading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pastAppointments.length > 0 && (
          <>
            <h5 className="text-secondary mt-4 mb-3">Historial</h5>
            {pastAppointments.map((appointment) => {
              const date = new Date(appointment.appointmentDate);
              return (
                <div
                  key={appointment.id}
                  className="card bg-dark border-secondary mb-2 p-3"
                  style={{ opacity: 0.7 }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="text-secondary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {date.toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      —{" "}
                      {date.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {appointment.barber && ` · ${appointment.barber.name}`}
                    </span>
                    <span
                      className={`badge bg-${STATUS_COLORS[appointment.status]}`}
                    >
                      {STATUS_LABELS[appointment.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
}

export default MyAppointmentsPage;
