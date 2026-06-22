// componente de paginado reutilizable, lo usamos en la agenda del barber, el superadmin y donde haga falta
// recibe los datos de la página actual y funciones para cambiarla
// sizes son los tamaños de página disponibles, por defecto 10/25/50
function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  total,
  sizes = [10, 25, 50],
}) {
  // si no hay nada para paginar no mostramos nada
  if (total === 0) return null;

  return (
    <div className="pagination-controls">

      {/* selector de cuántos resultados mostrar por página */}
      <div className="pagination-size">
        <span>Mostrar</span>
        {sizes.map((size) => (
          <button
            key={size}
            className={`btn-page-size ${pageSize === size ? "btn-page-size-active" : ""}`}
            onClick={() => onPageSizeChange(size)}
          >
            {size}
          </button>
        ))}
        {/* mostramos cuántos hay en total */}
        <span>por página · {total} resultados</span>
      </div>

      {/* navegación entre páginas, anterior los números y siguiente */}
      <div className="pagination-nav">
        <button
          className="btn-page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>

        {/* botón por cada página */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`btn-page ${currentPage === page ? "btn-page-active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="btn-page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          ›
        </button>
      </div>

    </div>
  );
}

export default PaginationControls;
