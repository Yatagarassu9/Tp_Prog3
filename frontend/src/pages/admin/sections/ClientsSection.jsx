import { useState, useEffect } from "react";
import {
  getAllUsersService,
  createUserAdminService,
  updateUserAdminService,
  deleteUserAdminService,
} from "../../../services/admin.services";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

// estado vacío para el formulario, lo reutilizamos al abrir y cerrar el modal
const EMPTY_FORM = { name: "", email: "", password: "", phone: "" };

function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // estado del paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // controlamos qué modal está abierto y para qué acción
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // si es null es creación, si tiene valor es edición
  const [deletingClient, setDeletingClient] = useState(null); // el cliente que queremos borrar

  // datos del formulario de crear/editar
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // cargamos los clientes al montar la sección
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setLoading(true);
    getAllUsersService(
      (data) => {
        // filtramos solo los usuarios con rol client
        setClients(data.filter((u) => u.role === "client"));
        setLoading(false);
      },
      () => {
        setError("No se pudieron cargar los clientes");
        setLoading(false);
      }
    );
  };

  // cuando abrimos el modal de editar cargamos los datos del cliente en el form
  const handleOpenEdit = (client) => {
    setEditingClient(client);
    // el email y la contraseña no se muestran al editar
    setForm({ name: client.name, phone: client.phone || "" });
    setFormError("");
    setShowForm(true);
  };

  // cuando abrimos el modal de crear limpiamos el form
  const handleOpenCreate = () => {
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  // manejamos el cambio de cada campo del form
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  // guardamos el cliente, ya sea creando uno nuevo o editando uno existente
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }

    setFormLoading(true);

    if (editingClient) {
      // al editar solo mandamos nombre y teléfono, sin email ni contraseña
      updateUserAdminService(
        editingClient.id,
        { name: form.name, phone: form.phone },
        () => {
          setFormLoading(false);
          handleCloseForm();
          loadClients();
        },
        (err) => {
          setFormLoading(false);
          setFormError(err.message);
        }
      );
    } else {
      // al crear necesitamos todos los campos obligatorios
      if (!form.email.trim() || !form.password.trim()) {
        setFormError("El email y la contraseña son obligatorios al crear");
        setFormLoading(false);
        return;
      }
      createUserAdminService(
        { ...form, role: "client" },
        () => {
          setFormLoading(false);
          handleCloseForm();
          loadClients();
        },
        (err) => {
          setFormLoading(false);
          setFormError(err.message);
        }
      );
    }
  };

  // eliminamos el cliente después de confirmar en el modal
  const handleConfirmDelete = () => {
    if (!deletingClient) return;
    deleteUserAdminService(
      deletingClient.id,
      () => {
        setDeletingClient(null);
        loadClients();
      },
      () => setDeletingClient(null)
    );
  };

  // calculamos qué clientes mostrar en la página actual
  const totalPages = Math.ceil(clients.length / pageSize);
  const paginated = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Clientes</h2>
        <button className="btn btn-warning text-dark" onClick={handleOpenCreate}>
          + Agregar cliente
        </button>
      </div>

      {loading && <p className="text-secondary">Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-secondary text-center">
                      No hay clientes registrados
                    </td>
                  </tr>
                ) : (
                  paginated.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone || "—"}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleOpenEdit(client)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeletingClient(client)}
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

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            total={clients.length}
          />
        </>
      )}

      {/* modal para crear o editar un cliente */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={handleCloseForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingClient ? "Editar cliente" : "Agregar cliente"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                  required
                />
              </div>

              {/* el email solo aparece al crear, no al editar */}
              {!editingClient && (
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control bg-secondary text-white border-secondary"
                    required
                  />
                </div>
              )}

              {/* la contraseña solo se pide al crear */}
              {!editingClient && (
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña (mínimo 7 caracteres)"
                    value={form.password}
                    onChange={handleChange}
                    className="form-control bg-secondary text-white border-secondary"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Teléfono (opcional)"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
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
                  onClick={handleCloseForm}
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

      {/* modal de confirmación para eliminar, solo se muestra si hay un cliente seleccionado */}
      {deletingClient && (
        <ConfirmModal
          title="Eliminar cliente"
          message={`¿Estás seguro de que querés eliminar a ${deletingClient.name}? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingClient(null)}
          confirmLabel="Eliminar"
          confirmClass="btn-danger"
        />
      )}
    </div>
  );
}

export default ClientsSection;
