import { useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/notFound.css";
import "../../styles/animations.css";

function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 | Cráneo Barbero";
  }, []);

  return (
    <div className="notfound-container page-transition">
      <div className="notfound-content">
        <span className="notfound-code">404</span>
        <i className="ti ti-scissors-off notfound-icon" />
        <h1 className="notfound-title">Página no encontrada</h1>
        <p className="notfound-subtitle">
          Parece que esta página se fue a cortar el pelo y no volvió.
          {/*chiste*/}
        </p>
        <div className="notfound-actions">
          <button className="btn-cta" onClick={() => navigate("/")}>
            {/*boton que manda al inicio*/}
            <i className="ti ti-home" />
            Volver al inicio
          </button>
          <button
            className="btn-outline-custom"
            onClick={() => navigate("/appointment")}
          >
            {/*boton que manda a sacar turno*/}
            Sacar turno
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
