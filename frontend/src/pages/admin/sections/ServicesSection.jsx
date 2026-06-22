import { useState, useEffect } from "react";
import {
  getAllCutsAdminService,
  createCutAdminService,
  updateCutAdminService,
  deleteCutAdminService,
} from "../../../services/admin.services";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

const EMPTY_FORM = { name: "", price: "" };

function ServicesSection() {
  const [cuts, setCuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editingCut, setEditingCut] = useState(null);
  const [deletingCut, setDeletingCut] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCuts();
  }, []);

  const loadCuts = () => {
    setLoading(true);
    getAllCutsAdminService(
      (data) => { setCuts(data); setLoading(false); },
      () => { setError("No se pudieron cargar los servicios"); setLoading(false); }
    );
  };

  const handleOpenEdit = (cut) => {
    setEditingCut(cut);
    setForm({ name: cut.name, price: cut.price });
    setFormError("");
    setShowForm(true);
  };

  const handleOpenCreate = () => {
    setEditingCut(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCut(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError("El nombre del servicio es obligatorio");
      return;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setFormError("El precio debe ser un número mayor a cero");
      return;
    }

    setFormLoading(true);

    // convertimos el precio a número porque viene del input como string
    const data = { name: form.name, price: Number(form.price) };

    if (editingCut) {
      updateCutAdminService(
        editingCut.id,
        data,
        () => { setFormLoading(false); handleCloseForm(); loadCuts(); },
        (err) => { setFormLoading(false); setFormError(err.message); }
      );
    } else {
      createCutAdminService(
        data,
        () => { setFormLoading(false); handleCloseForm(); loadCuts(); },
        (err) => { setFormLoading(false); setFormError(err.message); }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingCut) return;
    deleteCutAdminService(
      deletingCut.id,
      () => { setDeletingCut(null); loadCuts(); },
      () => setDeletingCut(null)
    );
  };

  const totalPages = Math.ceil(cuts.length / pageSize);
  const paginated = cuts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Servicios</h2>
        <button className="btn btn-warning text-dark" onClick={handleOpenCreate}>
          + Agregar servicio
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
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-secondary text-center">
                      No hay servicios registrados
                    </td>
                  </tr>
                ) : (
                  paginated.map((cut) => (
                    <tr key={cut.id}>
                      <td>{cut.name}</td>
                      <td className="text-warning">
                        ${Number(cut.price).toLocaleString("es-AR")}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleOpenEdit(cut)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeletingCut(cut)}
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
            total={cuts.length}
          />
        </>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={handleCloseForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingCut ? "Editar servicio" : "Agregar servicio"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del servicio"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control bg-secondary text-white border-secondary"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Precio"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
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

      {deletingCut && (
        <ConfirmModal
          title="Eliminar servicio"
          message={`¿Estás seguro de que querés eliminar el servicio "${deletingCut.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingCut(null)}
          confirmLabel="Eliminar"
          confirmClass="btn-danger"
        />
      )}
    </div>
  );
}

export default ServicesSection;
