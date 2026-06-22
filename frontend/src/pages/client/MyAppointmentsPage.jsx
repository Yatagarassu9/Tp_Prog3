import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { getMyAppointmentsService } from "../../components/auth/account.services";
import { cancelAppointmentService } from "../../services/appointments.services";
import AppointmentEditModal from "../../components/AppointmentEditModal/AppointmentEditModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

// etiquetas y colores para cada estado del turno
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

  // todos los turnos del cliente
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // turno que se está por cancelar, para mostrar el modal de confirmación
  const [cancelingId, setCancelingId] = useState(null);

  // turno que se está editando, para mostrar el modal de edición
  const [editingAppointment, setEditingAppointment] = useState(null);

  // mensaje de feedback después de una acción (cancelar o modificar)
  const [actionMsg, setActionMsg] = useState({ id: null, text: "", type: "" });

  useEffect(() => {
    document.title = " Mis turnos | Cráneo Barbero";
  }, []);

  // función para traer los turnos del servidor, la reutilizamos después de cada acción
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

  // cuando el usuario confirma la cancelación en el modal
  const handleConfirmCancel = () => {
    cancelAppointmentService(
      cancelingId,
      () => {
        // marcamos el turno como cancelado en el array local sin recargar
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === cancelingId ? { ...a, status: "cancelled" } : a,
          ),
        );
        setActionMsg({ id: cancelingId, text: "Turno cancelado.", type: "success" });
        setCancelingId(null);
      },
      (err) => {
        setActionMsg({ id: cancelingId, text: err.message, type: "danger" });
        setCancelingId(null);
      },
    );
  };

  if (!user) {
    return (
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
    );
  }

  const today = new Date();

  // separamos los turnos activos de los ya terminados o cancelados
  const activeAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed",
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "completed",
  );

  return (
    <div
      style={{
        paddingTop: "100px",
        paddingBottom: "40px",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "100px 20px 40px",
      }}
      className="page-transition"
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

        return (
          <div
            key={appointment.id}
            className="card bg-dark border-warning mb-3 p-4"
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-warning fw-bold" style={{ fontSize: "1rem" }}>
                  {date.toLocaleDateString("es-AR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-secondary ms-2" style={{ fontSize: "0.9rem" }}>
                  {date.toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <span className={`badge bg-${STATUS_COLORS[appointment.status]}`}>
                {STATUS_LABELS[appointment.status]}
              </span>
            </div>

            {appointment.barber && (
              <p className="text-light mb-1" style={{ fontSize: "0.9rem" }}>
                Barbero:{" "}
                <span className="text-white">{appointment.barber.name}</span>
              </p>
            )}

            {/* mensaje de feedback después de cancelar o modificar */}
            {actionMsg.id === appointment.id && actionMsg.text && (
              <div
                className={`alert alert-${actionMsg.type} py-2 mt-2`}
                style={{ fontSize: "0.85rem" }}
              >
                {actionMsg.text}
              </div>
            )}

            {/* solo mostramos los botones si el turno todavía no pasó */}
            {!isPast && (
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => setEditingAppointment(appointment)}
                >
                  Modificar
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setCancelingId(appointment.id)}
                >
                  Cancelar turno
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* historial de turnos completados y cancelados */}
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
                  <span className="text-secondary" style={{ fontSize: "0.9rem" }}>
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
                  <span className={`badge bg-${STATUS_COLORS[appointment.status]}`}>
                    {STATUS_LABELS[appointment.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* modal para modificar la fecha y horario del turno */}
      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSaved={(updatedId, newDate) => {
            // actualizamos la fecha en el array local sin recargar
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === updatedId ? { ...a, appointmentDate: newDate } : a,
              ),
            );
            setActionMsg({ id: updatedId, text: "Turno modificado correctamente.", type: "success" });
            setEditingAppointment(null);
          }}
        />
      )}

      {/* modal de confirmación antes de cancelar */}
      {cancelingId && (
        <ConfirmModal
          title="Cancelar turno"
          message="¿Estás seguro que querés cancelar este turno?"
          confirmLabel="Sí, cancelar"
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelingId(null)}
        />
      )}
    </div>
  );
}

export default MyAppointmentsPage;
