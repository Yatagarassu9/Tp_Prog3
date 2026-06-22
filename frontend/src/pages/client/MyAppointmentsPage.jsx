import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { getMyAppointmentsService } from "../../components/auth/account.services";
import { cancelAppointmentService } from "../../services/appointments.services";
import AppointmentEditModal from "../../components/AppointmentEditModal/AppointmentEditModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

// etiquetas y colores para mostrar el estado del turno de forma legible
const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Completado",
};

// los colores son clases de bootstrap, cada estado tiene el suyo
const STATUS_COLORS = {
  pending: "warning",
  confirmed: "success",
  cancelled: "secondary",
  completed: "info",
};

// pagina donde el cliente logueado ve y gestiona sus propios turnos
function MyAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // id del turno que se esta por cancelar, necesario para pasar al modal de confirmacion
  const [cancelingId, setCancelingId] = useState(null);

  // turno seleccionado para editar, se lo pasamos al AppointmentEditModal
  const [editingAppointment, setEditingAppointment] = useState(null);

  // mensaje de feedback que aparece debajo del turno afectado (no es un toast global)
  const [actionMsg, setActionMsg] = useState({ id: null, text: "", type: "" });

  useEffect(() => {
    document.title = " Mis turnos | Cráneo Barbero";
  }, []);

  // funcion reutilizable para traer los turnos del servidor
  // la llamamos al montar y tambien despues de cada accion
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

  // solo cargamos turnos si hay un usuario logueado
  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  // cuando confirma la cancelacion en el modal hacemos el request
  const handleConfirmCancel = () => {
    cancelAppointmentService(
      cancelingId,
      () => {
        // actualizamos el estado en el array local para no recargar toda la pagina
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

  // si no esta logueado mostramos un mensaje y boton para ir al login
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

  // separamos los turnos activos (pendientes) de los que ya terminaron o fueron cancelados
  // los activos muestran botones de accion, los del historial son de solo lectura
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

      {/* listado de turnos activos, cada uno con sus botones de modificar y cancelar */}
      {activeAppointments.map((appointment) => {
        const date = new Date(appointment.appointmentDate);
        const isPast = date <= today; // si ya paso la hora no mostramos los botones

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

            {/* mensaje de exito o error que aparece despues de cancelar o modificar */}
            {actionMsg.id === appointment.id && actionMsg.text && (
              <div
                className={`alert alert-${actionMsg.type} py-2 mt-2`}
                style={{ fontSize: "0.85rem" }}
              >
                {actionMsg.text}
              </div>
            )}

            {/* solo mostramos los botones si el turno aun no paso */}
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

      {/* historial de turnos completados y cancelados (incluyendo los que cancelo el barbero) */}
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

      {/* modal para cambiar la fecha y hora del turno */}
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

      {/* modal de confirmacion antes de cancelar */}
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
