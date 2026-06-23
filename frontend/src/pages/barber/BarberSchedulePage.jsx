import { useState, useEffect } from "react";
import { getBarberAppointmentsService } from "./barber.services";
import { cancelAppointmentService } from "../../services/appointments.services";
import useAppointmentFilters from "../../hooks/useAppointmentFilters";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";
import AppointmentEditModal from "../../components/AppointmentEditModal/AppointmentEditModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import PaginationControls from "../../components/PaginationControls/PaginationControls";
import "../../styles/barberDashboard.css";
import "../../styles/barberSchedule.css";
import "../../styles/appointmentModal.css";

function BarberSchedulePage() {
  // los turnos que vienen del servidor
  const [appointments, setAppointments] = useState([]);

  // turno seleccionado para ver el detalle en el modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // turno seleccionado para modificar fecha/horario
  const [editingAppointment, setEditingAppointment] = useState(null);

  // turno seleccionado para cancelar, lo usamos para el modal de confirmación
  const [cancelingId, setCancelingId] = useState(null);

  // controla si el modal del selector de fechas está abierto
  const [showDateModal, setShowDateModal] = useState(false);

  // el hook nos da todo el filtrado y paginado ya calculado
  const {
    activeFilter, setActiveFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    pageSize, setPageSize,
    currentPage, setCurrentPage,
    filtered, paginated, totalPages,
  } = useAppointmentFilters(appointments);

  useEffect(() => {
    document.title = " Mi agenda | Cráneo Barbero";
  }, []);

  useEffect(() => {
    // cuando carga la página traemos todos los turnos del barber
    getBarberAppointmentsService(
      (data) => setAppointments(data),
      () => setAppointments([]),
    );
  }, []);

  // cuando el usuario confirma la cancelación en el modal
  const handleConfirmCancel = () => {
    cancelAppointmentService(
      cancelingId,
      () => {
        // actualizamos el estado local marcando el turno como cancelado
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

  const now = new Date();

  // para saber si el horario de un turno ya pasó
  const isPast = (date) => new Date(date) < now;

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

  return (
    <div className="barber-dashboard page-transition">

      {/* botones para filtrar por estado del turno */}
      <section className="agenda-filters">
        {[
          { key: "all", label: "Todos" },
          { key: "pending", label: "Por atender" },
          { key: "completed", label: "Ya atendidos" },
          { key: "cancelled", label: "Cancelados" },
        ].map((f) => (
          <button
            key={f.key}
            className={`btn-filter ${activeFilter === f.key ? "btn-filter-active" : ""}`}
            onClick={() => { setActiveFilter(f.key); if (f.key === "all") { setDateFrom(""); setDateTo(""); } }}
          >
            {f.label}
          </button>
        ))}

        {/* botón para abrir el selector de rango de fechas */}
        <button
          className="btn-filter btn-filter-date"
          onClick={() => setShowDateModal(true)}
        >
          {dateFrom || dateTo
            ? `${dateFrom || "..."} → ${dateTo || "..."}`
            : "Seleccionar rango de días"}
        </button>

        {/* si hay rango activo mostramos botón para limpiarlo */}
        {(dateFrom || dateTo) && (
          <button
            className="btn-filter btn-filter-clear"
            onClick={() => { setDateFrom(""); setDateTo(""); }}
          >
            Limpiar rango
          </button>
        )}
      </section>

      {/* modal del selector de rango de fechas */}
      {showDateModal && (
        <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Seleccionar rango de días</h3>

            <div className="modal-row">
              <span className="modal-label">Desde</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="modal-date-input"
              />
            </div>

            <div className="modal-row">
              <span className="modal-label">Hasta</span>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="modal-date-input"
              />
            </div>

            {/* aclaración para ver solo un día */}
            <p className="modal-hint">
              Para ver solo un día, poné la misma fecha en los dos campos.
            </p>

            <button className="modal-close" onClick={() => setShowDateModal(false)}>
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* controles de paginado arriba de la lista */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        total={filtered.length}
      />

      {/* lista de turnos filtrados y paginados */}
      <section className="barber-agenda">
        {paginated.length === 0 ? (
          <p className="no-appointments-day">No hay turnos para mostrar.</p>
        ) : (
          paginated.map((appointment) => {
            const isPassedAppointment = isPast(appointment.appointmentDate);
            const isCancelled = appointment.status === "cancelled";
            return (
              <div
                key={appointment.id}
                className={`agenda-row ${isPassedAppointment || isCancelled ? "agenda-row-past" : ""}`}
              >
                <span className="agenda-time">
                  {formatTime(appointment.appointmentDate)}
                </span>
                <span className="agenda-date">
                  {formatDayTitle(new Date(appointment.appointmentDate))}
                </span>

                {/* al hacer click en el nombre se abre el modal de detalle */}
                <span
                  className="agenda-client"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  {appointment.client?.name}
                </span>

                <span className="agenda-service">
                  {appointment.cut?.name || appointment.Cut?.name || "—"}
                </span>

                <div className="agenda-actions">
                  {/* badge de cancelado al final de la fila */}
                  {isCancelled && (
                    <span className="badge bg-danger ms-auto">CANCELADO</span>
                  )}
                  {/* botones solo si el turno no pasó y no está cancelado */}
                  {!isPassedAppointment && !isCancelled && (
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
      </section>

      {/* controles de paginado abajo de la lista también */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        total={filtered.length}
      />

      {/* modal de detalle del turno */}
      <AppointmentModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* modal para modificar fecha y horario del turno */}
      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSaved={(updatedId, newDate) => {
            // actualizamos la fecha del turno en el array local sin recargar
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === updatedId ? { ...a, appointmentDate: newDate } : a,
              ),
            );
            setEditingAppointment(null);
          }}
        />
      )}

      {/* modal de confirmación antes de cancelar un turno */}
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

export default BarberSchedulePage;
