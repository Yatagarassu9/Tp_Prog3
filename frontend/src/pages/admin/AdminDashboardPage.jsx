import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { getAllAppointmentsAdminService } from "../../services/admin.services";
import { getAllUsersService } from "../../services/admin.services";
import { getAllBranchesAdminService } from "../../services/admin.services";
import "../../styles/adminDashboard.css";

// pagina de inicio del admin con estadisticas generales del negocio
function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = " Inicio | Panel Admin";
  }, []);

  // cargamos los tres recursos en paralelo al montar el componente
  // usamos un contador para saber cuando terminaron los tres fetches y recien ahi sacamos el loading
  useEffect(() => {
    let pendingRequests = 3;

    const checkDone = () => {
      pendingRequests -= 1;
      if (pendingRequests === 0) setLoading(false);
    };

    getAllAppointmentsAdminService(
      (data) => { setAppointments(data); checkDone(); },
      () => { setAppointments([]); checkDone(); }
    );

    getAllUsersService(
      (data) => { setUsers(data); checkDone(); },
      () => { setUsers([]); checkDone(); }
    );

    getAllBranchesAdminService(
      (data) => { setBranches(data); checkDone(); },
      () => { setBranches([]); checkDone(); }
    );
  }, []);

  // ===== CÁLCULO DE STATS =====

  // filtro de mes unificado para todas las estadísticas, formato YYYY-MM
  const [statsMonth, setStatsMonth] = useState("");

  // función helper: devuelve el mes en formato YYYY-MM de una fecha
  const getMonth = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // filtramos los turnos según el mes seleccionado
  const filteredAppointments = statsMonth
    ? appointments.filter((a) => getMonth(a.appointmentDate) === statsMonth)
    : appointments;

  // contamos los turnos por estado (con el filtro aplicado)
  const pending = filteredAppointments.filter((a) => a.status === "pending").length;
  const completed = filteredAppointments.filter((a) => a.status === "completed").length;
  const cancelled = filteredAppointments.filter((a) => a.status === "cancelled").length;

  // sacamos los meses unicos que tienen turnos para el selector de filtro
  const availableMonths = [
    ...new Set(
      appointments.map((a) => getMonth(a.appointmentDate))
    ),
  ].sort().reverse();

  // sumamos el precio de cada turno completado para calcular lo facturado
  const totalRevenue = filteredAppointments
    .filter((a) => a.status === "completed" && a.cut?.price)
    .reduce((sum, a) => sum + Number(a.cut.price), 0);

  // solo contamos los usuarios con rol "client", los admin no se incluyen
  const totalClients = users.filter((u) => u.role === "client").length;

  // para el servicio mas pedido contamos cuantas veces aparece cada nombre de corte
  const cutCounts = filteredAppointments.reduce((acc, a) => {
    const cutName = a.cut?.name;
    if (!cutName) return acc;
    acc[cutName] = (acc[cutName] || 0) + 1;
    return acc;
  }, {});
  const topCutName = Object.keys(cutCounts).length
    ? Object.keys(cutCounts).reduce((a, b) => (cutCounts[a] > cutCounts[b] ? a : b))
    : null;

  // cruzamos los turnos completados con las sucursales para saber cuantos atendio cada una
  const appointmentsByBranch = branches.map((branch) => {
    const count = filteredAppointments.filter(
      (a) => a.status === "completed" && a.barber?.branchId === branch.id
    ).length;
    return { name: branch.name, count };
  });

  // agrupamos los turnos completados por barbero para el ranking
  const barberMap = {};
  filteredAppointments.forEach((a) => {
    if (a.barber) {
      barberMap[a.barber.id] = a.barber.name;
    }
  });
  const appointmentsByBarber = Object.entries(barberMap).map(([id, name]) => {
    const count = filteredAppointments.filter(
      (a) => a.status === "completed" && a.barber?.id === Number(id)
    ).length;
    return { name, count };
  }).sort((a, b) => b.count - a.count); // ordenamos de mas a menos turnos completados

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <p className="text-warning">Debés iniciar sesión para acceder al panel.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard page-transition">
      <div className="admin-dashboard-header">
        <h1 className="admin-title">Panel de administración</h1>
        <p className="admin-subtitle">Bienvenido, {user.name}</p>
      </div>

      {loading ? (
        <p className="text-secondary text-center mt-5">Cargando estadísticas...</p>
      ) : (
        <>
          {/* filtro de mes unificado para todas las estadísticas */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="text-secondary" style={{ fontSize: "14px" }}>Filtrar por mes:</span>
            <select
              value={statsMonth}
              onChange={(e) => setStatsMonth(e.target.value)}
              className="form-select form-select-sm bg-secondary text-white border-secondary"
              style={{ maxWidth: "180px" }}
            >
              <option value="">Todos los meses</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* primera fila: numeros mas importantes */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-value text-warning">{pending}</span>
              <span className="admin-stat-label">Turnos pendientes</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value text-success">{completed}</span>
              <span className="admin-stat-label">Turnos completados</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value text-danger">{cancelled}</span>
              <span className="admin-stat-label">Turnos cancelados</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value text-info">{totalClients}</span>
              <span className="admin-stat-label">Clientes registrados</span>
            </div>
          </section>

          {/* segunda fila: monto facturado con filtro por mes, y servicio mas pedido */}
          <section className="admin-stats-grid admin-stats-grid-2">
            <div className="admin-stat-card admin-stat-card-wide">
              <span className="admin-stat-value text-warning">
                ${totalRevenue.toLocaleString("es-AR")}
              </span>
              <span className="admin-stat-label">Total facturado</span>
            </div>
            <div className="admin-stat-card admin-stat-card-wide">
              <span className="admin-stat-value admin-stat-value-text">
                {topCutName || "Sin datos"}
              </span>
              <span className="admin-stat-label">Servicio más pedido</span>
            </div>
          </section>

          {/* tablas con el desglose por sucursal y por barbero lado a lado */}
          <section className="admin-breakdown-grid">
            <div className="admin-breakdown-card">
              <h3 className="admin-breakdown-title">Atendidos por sucursal</h3>
              {appointmentsByBranch.length === 0 ? (
                <p className="text-secondary" style={{ fontSize: "14px" }}>Sin datos</p>
              ) : (
                <table className="admin-breakdown-table">
                  <thead>
                    <tr>
                      <th>Sucursal</th>
                      <th>Completados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsByBranch.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td className="text-warning">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="admin-breakdown-card">
              <h3 className="admin-breakdown-title">Atendidos por barbero</h3>
              {appointmentsByBarber.length === 0 ? (
                <p className="text-secondary" style={{ fontSize: "14px" }}>Sin datos</p>
              ) : (
                <table className="admin-breakdown-table">
                  <thead>
                    <tr>
                      <th>Barbero</th>
                      <th>Completados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsByBarber.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td className="text-warning">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* botones rapidos para ir a cada seccion de gestion */}
          <section className="admin-quick-access">
            <h2 className="admin-section-title">Gestión rápida</h2>
            <p className="text-secondary mb-4" style={{ fontSize: "14px" }}>
              Accedé a cada sección desde acá o desde el menú "Gestionar"
            </p>
            <div className="admin-quick-grid">
              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/manage?tab=clients")}
              >
                Clientes
              </button>
              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/manage?tab=barbers")}
              >
                Barberos
              </button>
              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/manage?tab=branches")}
              >
                Sucursales
              </button>
              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/manage?tab=services")}
              >
                Servicios
              </button>
              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/manage?tab=appointments")}
              >
                Turnos
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;
