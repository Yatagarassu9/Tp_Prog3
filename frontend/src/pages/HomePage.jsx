import "../styles/home.css";
import "../styles/animations.css";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router";
import useBranches from "../hooks/useBranches.js";
import StatCounter from "../components/StatCounter/StatCounter";
import stats from "../data/stats";

function HomePage() {
  const navigate = useNavigate();
  const branches = useBranches();

  return (
    <div className="home-container page-transition">
      <Navbar />
      <section id="hero" className="hero">
        <img
          src="/images/LogoHomePage-removebg.png"
          className="hero-logo"
          alt="logo"
        />
        <span className="hero-badge">Desde 2020 en Rosario</span>
        <h1 className="hero-h1">
          Tu mejor versión,{" "}
          <span className="text-gold">siempre a un turno</span> de distancia
        </h1>
        <p className="hero-subtitle">
          Tres sucursales en la ciudad. Forjador de imágen. Reservá en segundos,
          sin esperas.
        </p>
        <div className="hero-cta">
          <h2 className="hero-cta-title">¿Listo para tu próximo corte?</h2>
          <p className="hero-cta-subtitle">
            Elegí sucursal, barbero de confianza, día y hora en menos de un
            minuto
          </p>
          <button className="btn-cta" onClick={() => navigate("/appointment")}>
            <i className="ti ti-scissors"></i>
            Sacar turno ahora
          </button>
        </div>
      </section>

      <section id="branches" className="branches">
        <span className="section-label">Dónde encontrarnos</span>
        <h2 className="section-title">Nuestras sucursales</h2>
        <div className="branches-grid">
          {branches.map((branch) => (
            <div key={branch.name} className="branch-card">
              <img
                src={branch.imageUrl}
                alt={branch.name}
                className="branch-card-img"
              />
              <div className="branch-card-body">
                <h3 className="branch-card-title">{branch.name}</h3>
                <p>Dirección: {branch.address}</p>
                <p>Teléfono: {branch.phone}</p>
                <button
                  className="btn-outline-custom"
                  onClick={() => navigate("/appointment")}
                >
                  Sacar turno →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="stats">
        {stats.map((stat) => (
          <StatCounter key={stat.label} {...stat} />
        ))}
      </section>
      <section id="history" className="history">
        <span className="section-label">NUESTRA HISTORIA</span>
        <h2 className="section-title">De un local a una cadena</h2>
        <div className="history-content">
          <img
            src="/images/Barberia Sucursal Arroyito.jpg"
            alt="local"
            className="history-img"
          />
          <div className="history-text">
            <p>
              Lo que empezó con un sillón y unas tijeras, hoy es una de las
              barberías más reconocidas de Rosario.
            </p>
            <p>
              Cada sucursal mantiene el espíritu del primer local: atención
              personalizada, ambiente relajado y cortes que hablan por sí solos.
            </p>
            <div className="history-timeline">
              <div className="timeline-item">
                <span className="timeline-year">2020</span>
                <p>Apertura del primer local en Arroyito</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-year">2022</span>
                <p>Segunda sucursal en el Centro</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-year">2025</span>
                <p>Funes - Fisherton y sistema de turnos online</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
