import { useState, useEffect } from "react";
import {
  getAllBarbersAdminService,
  createBarberAdminService,
  updateBarberAdminService,
  deleteBarberAdminService,
} from "../../../services/admin.services";
import { getAllBranchesAdminService } from "../../../services/admin.services";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import Toast from "../../../components/Toast/Toast";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  branchId: "",
  yearsOfExperience: "",
  imageUrl: "",
};

function BarbersSection() {
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]); // las necesitamos para el select de sucursales en el form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [deletingBarber, setDeletingBarber] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    loadBarbers();
    // cargamos las sucursales para el select del formulario
    getAllBranchesAdminService(
      (data) => setBranches(data),
      () => setBranches([])
    );
  }, []);

  const loadBarbers = () => {
    setLoading(true);
    getAllBarbersAdminService(
      (data) => { setBarbers(data); setLoading(false); },
      () => { setError("No se pudieron cargar los barberos"); setLoading(false); }
    );
  };

  const handleOpenEdit = (barber) => {
    setEditingBarber(barber);
    setForm({
      name: barber.name,
      phone: barber.phone || "",
      branchId: barber.branchId || "",
      yearsOfExperience: barber.yearsOfExperience || "",
      imageUrl: barber.imageUrl || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleOpenCreate = () => {
    setEditingBarber(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBarber(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }

    setFormLoading(true);

    if (editingBarber) {
      const updateData = {
        name: form.name,
        phone: form.phone,
        branchId: form.branchId || null,
        yearsOfExperience: form.yearsOfExperience,
        imageUrl: form.imageUrl || null,
      };
      updateBarberAdminService(
        editingBarber.id,
        updateData,
        () => { setFormLoading(false); handleCloseForm(); loadBarbers(); showToast("Barbero actualizado correctamente"); },
        (err) => { setFormLoading(false); setFormError(err.message); }
      );
    } else {
      if (!form.email.trim()) {
        setFormError("El email es obligatorio");
        setFormLoading(false);
        return;
      }
      if (!form.password.trim()) {
        setFormError("La contraseña es obligatoria");
        setFormLoading(false);
        return;
      }
      if (form.password.length < 7) {
        setFormError("La contraseña debe tener al menos 7 caracteres");
        setFormLoading(false);
        return;
      }
      createBarberAdminService(
        { ...form, branchId: form.branchId || null },
        () => { setFormLoading(false); handleCloseForm(); loadBarbers(); showToast("Barbero creado correctamente"); },
        (err) => { setFormLoading(false); setFormError(err.message); }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingBarber) return;
    deleteBarberAdminService(
      deletingBarber.id,
      () => { setDeletingBarber(null); loadBarbers(); showToast("Barbero eliminado correctamente"); },
      () => { setDeletingBarber(null); showToast("No se pudo eliminar el barbero", "danger"); }
    );
  };

  // buscamos el nombre de la sucursal a partir del id que tiene el barbero
  const getBranchName = (branchId) => {
    const found = branches.find((b) => b.id === branchId);
    return found ? found.name : "—";
  };

  const filteredBarbers = search.trim()
    ? barbers.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.email.toLowerCase().includes(search.toLowerCase()),
      )
    : barbers;

  const totalPages = Math.ceil(filteredBarbers.length / pageSize);
  const paginated = filteredBarbers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Barberos</h2>
        <button className="btn btn-warning text-dark" onClick={handleOpenCreate}>
          + Agregar barbero
        </button>
      </div>

      {loading && <p className="text-secondary">Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="form-control bg-secondary text-white border-secondary mb-3"
          />
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Sucursal</th>
                  <th>Experiencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-secondary text-center">
                      No hay barberos registrados
                    </td>
                  </tr>
                ) : (
                  paginated.map((barber) => (
                    <tr key={barber.id}>
                      <td>{barber.name}</td>
                      <td>{barber.email}</td>
                      <td>{barber.phone || "—"}</td>
                      <td>{getBranchName(barber.branchId)}</td>
                      <td>{barber.yearsOfExperience ? `${barber.yearsOfExperience} años` : "—"}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleOpenEdit(barber)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeletingBarber(barber)}
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
            total={filteredBarbers.length}
          />
        </>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={handleCloseForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingBarber ? "Editar barbero" : "Agregar barbero"}
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

              {/* email y contraseña solo al crear */}
              {!editingBarber && (
                <>
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
                </>
              )}

              <div className="mb-3">
                <input
                  type="text"
                  name="phone"
                  placeholder="Teléfono (opcional)"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                />
              </div>

              {/* select de sucursal para asignarle una al barbero */}
              <div className="mb-3">
                <select
                  name="branchId"
                  value={form.branchId}
                  onChange={handleChange}
                  className="form-select bg-secondary text-white border-secondary"
                >
                  <option value="">Sin sucursal asignada</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="yearsOfExperience"
                  placeholder="Años de experiencia (opcional)"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                />
              </div>

              <div className="mb-4">

                <label className="text-secondary d-block mb-1" style={{ fontSize: "13px" }}>
                  Foto del barbero (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}

                  className="form-control bg-secondary text-white border-secondary"
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "50%", marginTop: "8px", border: "2px solid #ffc107" }}
                  />
                )}
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

      {deletingBarber && (
        <ConfirmModal
          title="Eliminar barbero"
          message={`¿Estás seguro de que querés eliminar a ${deletingBarber.name}? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBarber(null)}
          confirmLabel="Eliminar"
          confirmClass="btn btn-danger"
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default BarbersSection;
