import { useState, useEffect } from "react";
import {
  getAllAppointmentsAdminService,
  getAllBarbersAdminService,
  getAllBranchesAdminService,
  getAllCutsAdminService,
  getAllUsersService,
  createAppointmentAdminService,
  deleteAppointmentAdminService,
} from "../../../services/admin.services";
import { updateAppointmentService } from "../../../services/appointments.services";
import useAppointmentFilters from "../../../hooks/useAppointmentFilters";
import AppointmentEditModal from "../../../components/AppointmentEditModal/AppointmentEditModal";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import "../../../styles/appointmentModal.css";

// etiquetas y colores por estado, igual que en las otras páginas
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

// form vacío para crear un turno nuevo
const EMPTY_FORM = { clientId: "", barberId: "", cutId: "", appointmentDate: "" };

function AppointmentsSection() {
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [clients, setClients] = useState([]); // los necesitamos para el select de cliente al crear

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal de editar fecha/hora (reutilizamos el AppointmentEditModal)
  const [editingAppointment, setEditingAppointment] = useState(null);

  // modal de confirmación para eliminar
  const [deletingId, setDeletingId] = useState(null);

  // modal de crear turno
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // usamos el hook de filtros que ya tiene soporte para barbero y sucursal
  const {
    activeFilter, setActiveFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    filterBarberId, setFilterBarberId,
    filterBranchId, setFilterBranchId,
    pageSize, setPageSize,
    currentPage, setCurrentPage,
    filtered, paginated, totalPages,
  } = useAppointmentFilters(appointments);

  // cargamos los datos al montar la sección
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    setLoading(true);
    let pending = 5;
    const done = () => { pending -= 1; if (pending === 0) setLoading(false); };

    getAllAppointmentsAdminService((data) => { setAppointments(data); done(); }, () => { setAppointments([]); done(); });
    getAllBarbersAdminService((data) => { setBarbers(data); done(); }, () => { setBarbers([]); done(); });
    getAllBranchesAdminService((data) => { setBranches(data); done(); }, () => { setBranches([]); done(); });
    getAllCutsAdminService((data) => { setCuts(data); done(); }, () => { setCuts([]); done(); });
    getAllUsersService(
      (data) => { setClients(data.filter((u) => u.role === "client")); done(); },
      () => { setClients([]); done(); }
    );
  };

  const loadAppointments = () => {
    getAllAppointmentsAdminService(
      (data) => setAppointments(data),
      () => setAppointments([])
    );
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setShowCreateForm(true);
  };

  const handleCloseCreate = () => {
    setShowCreateForm(false);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();

    if (!form.clientId || !form.barberId || !form.cutId || !form.appointmentDate) {
      setFormError("Todos los campos son obligatorios");
      return;
    }

    setFormLoading(true);
    createAppointmentAdminService(
      {
        clientId: Number(form.clientId),
        barberId: Number(form.barberId),
        cutId: Number(form.cutId),
        appointmentDate: form.appointmentDate,
      },
      () => {
        setFormLoading(false);
        handleCloseCreate();
        loadAppointments();
      },
      (err) => {
        setFormLoading(false);
        setFormError(err.message);
      }
    );
  };

  // cuando el AppointmentEditModal confirma el cambio, recargamos los turnos
  const handleEditSuccess = () => {
    setEditingAppointment(null);
    loadAppointments();
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteAppointmentAdminService(
      deletingId,
      () => { setDeletingId(null); loadAppointments(); },
      () => setDeletingId(null)
    );
  };

  // limpiar el rango de fechas y los filtros de barbero/sucursal
  const handleClearFilters = () => {
    setActiveFilter("all");
    setDateFrom("");
    setDateTo("");
    setFilterBarberId("");
    setFilterBranchId("");
  };

  // función para formatear la fecha del turno
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Turnos</h2>
        <button className="btn btn-warning text-dark" onClick={handleOpenCreate}>
          + Agregar turno
        </button>
      </div>

      {/* barra de filtros */}
      <div className="admin-filters">
        {/* filtros por estado */}
        <div className="admin-filter-row">
          {["all", "pending", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              className={`admin-filter-btn ${activeFilter === f ? "admin-filter-btn-active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === "all" ? "Todos" : STATUS_LABELS[f] || f}
            </button>
          ))}
        </div>

        {/* filtros por fecha, barbero y sucursal */}
        <div className="admin-filter-row admin-filter-row-selects">
          <div className="admin-filter-dates">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="form-control form-control-sm bg-secondary text-white border-secondary"
              title="Desde"
            />
            <span className="text-secondary">al</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="form-control form-control-sm bg-secondary text-white border-secondary"
              title="Hasta"
            />
          </div>

          {/* select de sucursal para filtrar */}
          <select
            value={filterBranchId}
            onChange={(e) => setFilterBranchId(e.target.value)}
            className="form-select form-select-sm bg-secondary text-white border-secondary admin-filter-select"
          >
            <option value="">Todas las sucursales</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* select de barbero para filtrar */}
          <select
            value={filterBarberId}
            onChange={(e) => setFilterBarberId(e.target.value)}
            className="form-select form-select-sm bg-secondary text-white border-secondary admin-filter-select"
          >
            <option value="">Todos los barberos</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleClearFilters}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {loading && <p className="text-secondary">Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Cliente</th>
                  <th>Barbero</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-secondary text-center">
                      No hay turnos con esos filtros
                    </td>
                  </tr>
                ) : (
                  paginated.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{appointment.client?.name || "—"}</td>
                      <td>{appointment.barber?.name || "—"}</td>
                      <td>{appointment.cut?.name || "—"}</td>
                      <td>
                        <span className={`badge bg-${STATUS_COLORS[appointment.status] || "secondary"}`}>
                          {STATUS_LABELS[appointment.status] || appointment.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => setEditingAppointment(appointment)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeletingId(appointment.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-secondary" style={{ fontSize: "13px", marginTop: "8px" }}>
            Mostrando {filtered.length} turno{filtered.length !== 1 ? "s" : ""}
          </p>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            total={filtered.length}
          />
        </>
      )}

      {/* modal de editar fecha/hora, reutilizamos el que ya teníamos */}
      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          onSuccess={handleEditSuccess}
          onClose={() => setEditingAppointment(null)}
        />
      )}

      {/* modal de crear turno */}
      {showCreateForm && (
        <div className="admin-modal-overlay" onClick={handleCloseCreate}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Agregar turno</h3>
            <form onSubmit={handleSubmitCreate}>
              <div className="mb-3">
                <select
                  name="clientId"
                  value={form.clientId}
                  onChange={handleChange}
                  className="form-select bg-secondary text-white border-secondary"
                  required
                >
                  <option value="">Seleccioná un cliente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <select
                  name="barberId"
                  value={form.barberId}
                  onChange={handleChange}
                  className="form-select bg-secondary text-white border-secondary"
                  required
                >
                  <option value="">Seleccioná un barbero</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <select
                  name="cutId"
                  value={form.cutId}
                  onChange={handleChange}
                  className="form-select bg-secondary text-white border-secondary"
                  required
                >
                  <option value="">Seleccioná un servicio</option>
                  {cuts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — ${Number(c.price).toLocaleString("es-AR")}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                  required
                />
              </div>

              {formError && (
                <p className="text-danger mb-3" style={{ fontSize: "14px" }}>
                  {formError}
                </p>
              )}

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={handleCloseCreate}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-warning text-dark w-100"
                  disabled={formLoading}
                >
                  {formLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <ConfirmModal
          title="Eliminar turno"
          message="¿Estás seguro de que querés eliminar este turno? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
          confirmLabel="Eliminar"
          confirmClass="btn-danger"
        />
      )}
    </div>
  );
}

export default AppointmentsSection;
