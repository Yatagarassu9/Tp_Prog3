import "../styles/home.css";
import "../styles/animations.css";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
    <div className="home-container  ">
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
    </div>
    </Layout>
  );
}

export default HomePage;
