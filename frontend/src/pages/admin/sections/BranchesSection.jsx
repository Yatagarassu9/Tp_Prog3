import { useState, useEffect } from "react";
import {
  getAllBranchesAdminService,
  createBranchAdminService,
  updateBranchAdminService,
  deleteBranchAdminService,
} from "../../../services/admin.services";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

const EMPTY_FORM = { name: "", address: "", phone: "", imageUrl: "" };

function BranchesSection() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = () => {
    setLoading(true);
    getAllBranchesAdminService(
      (data) => { setBranches(data); setLoading(false); },
      () => { setError("No se pudieron cargar las sucursales"); setLoading(false); }
    );
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setForm({ name: branch.name, address: branch.address, phone: branch.phone || "", imageUrl: branch.imageUrl || "" });
    setFormError("");
    setShowForm(true);
  };

  const handleOpenCreate = () => {
    setEditingBranch(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBranch(null);
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

    if (!form.name.trim() || !form.address.trim()) {
      setFormError("El nombre y la dirección son obligatorios");
      return;
    }

    setFormLoading(true);

    if (editingBranch) {
      updateBranchAdminService(
        editingBranch.id,
        form,
        () => { setFormLoading(false); handleCloseForm(); loadBranches(); },
        (err) => { setFormLoading(false); setFormError(err.message); }
      );
    } else {
      createBranchAdminService(
        form,
        () => { setFormLoading(false); handleCloseForm(); loadBranches(); },
        (err) => { setFormLoading(false); setFormError(err.message); }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingBranch) return;
    deleteBranchAdminService(
      deletingBranch.id,
      () => { setDeletingBranch(null); loadBranches(); },
      () => setDeletingBranch(null)
    );
  };

  const totalPages = Math.ceil(branches.length / pageSize);
  const paginated = branches.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Sucursales</h2>
        <button className="btn btn-warning text-dark" onClick={handleOpenCreate}>
          + Agregar sucursal
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
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-secondary text-center">
                      No hay sucursales registradas
                    </td>
                  </tr>
                ) : (
                  paginated.map((branch) => (
                    <tr key={branch.id}>
                      <td>{branch.name}</td>
                      <td>{branch.address}</td>
                      <td>{branch.phone || "—"}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleOpenEdit(branch)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeletingBranch(branch)}
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
            total={branches.length}
          />
        </>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={handleCloseForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingBranch ? "Editar sucursal" : "Agregar sucursal"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre de la sucursal"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                  required
                />
              </div>
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

              <div className="mb-4">
                <label className="text-secondary d-block mb-1" style={{ fontSize: "13px" }}>
                  Foto de la sucursal (opcional)
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
                    style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "6px", marginTop: "8px", border: "2px solid #ffc107" }}
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

      {deletingBranch && (
        <ConfirmModal
          title="Eliminar sucursal"
          message={`¿Estás seguro de que querés eliminar la sucursal "${deletingBranch.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBranch(null)}
          confirmLabel="Eliminar"
          confirmClass="btn-danger"
        />
      )}
    </div>
  );
}

export default BranchesSection;
