import { useState, useEffect } from "react";

// hook para manejar filtros y paginado de turnos
// lo usamos en la agenda del barber y en el panel admin
// recibe el array de turnos y devuelve todo lo necesario para filtrar y paginar
function useAppointmentFilters(appointments) {
  // filtro activo por estado, puede ser "all", "pending", "completed" o "cancelled"
  const [activeFilter, setActiveFilter] = useState("all");

  // rango de fechas, si están vacíos no se aplica el filtro de fechas
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // filtros extra para el admin, por barbero y sucursal
  // son strings vacíos por defecto así no afectan la agenda del barber
  const [filterBarberId, setFilterBarberId] = useState("");
  const [filterBranchId, setFilterBranchId] = useState("");

  // cuántos resultados mostrar por página
  const [pageSize, setPageSize] = useState(10);

  // página actual
  const [currentPage, setCurrentPage] = useState(1);

  // cada vez que cambia algo del filtro, volvemos a la primera página
  // para no quedar en una página que ya no existe
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, dateFrom, dateTo, pageSize, filterBarberId, filterBranchId]);

  // filtramos por estado
  const filteredByStatus = appointments.filter((a) => {
    if (activeFilter === "pending")
      return a.status === "pending" || a.status === "confirmed";
    if (activeFilter === "completed") return a.status === "completed";
    if (activeFilter === "cancelled") return a.status === "cancelled";
    return true; // "all" muestra todo
  });

  // después filtramos por rango de fechas, barbero y sucursal, y ordenamos
  const filtered = filteredByStatus
    .filter((a) => {
      const date = new Date(a.appointmentDate);
      if (dateFrom && date < new Date(dateFrom)) return false;
      if (dateTo) {
        // incluimos todo el día "hasta"
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (date > end) return false;
      }
      // si hay un barbero seleccionado, filtramos por él
      if (filterBarberId && String(a.barber?.id) !== String(filterBarberId)) return false;
      // si hay una sucursal seleccionada, la comparamos con la sucursal del barbero del turno
      if (filterBranchId && String(a.barber?.branchId) !== String(filterBranchId)) return false;
      return true;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  // cuántas páginas hay en total
  const totalPages = Math.ceil(filtered.length / pageSize);

  // recortamos el array para la página actual
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // devolvemos todo lo que necesita el componente que use este hook
  return {
    activeFilter,
    setActiveFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filterBarberId,
    setFilterBarberId,
    filterBranchId,
    setFilterBranchId,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    filtered,
    paginated,
    totalPages,
  };
}

export default useAppointmentFilters;