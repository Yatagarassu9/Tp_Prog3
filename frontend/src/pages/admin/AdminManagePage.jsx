import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import ClientsSection from "./sections/ClientsSection";
import BarbersSection from "./sections/BarbersSection";
import BranchesSection from "./sections/BranchesSection";
import ServicesSection from "./sections/ServicesSection";
import AppointmentsSection from "./sections/AppointmentsSection";
import "../../styles/adminDashboard.css";

// las pestañas disponibles con su id y etiqueta
const TABS = [
  { id: "clients", label: "Clientes" },
  { id: "barbers", label: "Barberos" },
  { id: "branches", label: "Sucursales" },
  { id: "services", label: "Servicios" },
  { id: "appointments", label: "Turnos" },
];

function AdminManagePage() {
  const { user } = useAuth();
  const location = useLocation();

  // leemos el parámetro tab de la URL para que los accesos rápidos del dashboard funcionen
  // si no hay parámetro, arrancamos en clientes por defecto
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    return TABS.find((t) => t.id === tab) ? tab : "clients";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    document.title = " Gestionar | Panel Admin";
  }, []);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <p className="text-warning">Debés iniciar sesión para acceder al panel.</p>
      </div>
    );
  }

  // según la pestaña activa renderizamos la sección correspondiente
  const renderSection = () => {
    switch (activeTab) {
      case "clients":
        return <ClientsSection />;
      case "barbers":
        return <BarbersSection />;
      case "branches":
        return <BranchesSection />;
      case "services":
        return <ServicesSection />;
      case "appointments":
        return <AppointmentsSection />;
      default:
        return <ClientsSection />;
    }
  };

  return (
    <div className="admin-dashboard page-transition">
      <div className="admin-dashboard-header">
        <h1 className="admin-title">Gestionar</h1>
      </div>

      {/* barra de pestañas para navegar entre las secciones */}
      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? "admin-tab-btn-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* acá se renderiza la sección activa */}
      <div className="admin-tab-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminManagePage;
