import "../../styles/footer.css";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-title">Barbería Cráneo Barbero</span>
          <p className="footer-tagline">
            Tu mejor versión, siempre a un turno de distancia.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-section-title">Navegación</h4>
          <a href="#hero">Inicio</a>
          <a href="#branches">Sucursales</a>
          <a href="#history">Nosotros</a>
          <Link to="/appointment">Sacar turno</Link>
        </div>

        <div className="footer-contact">
          <h4 className="footer-section-title">Contacto</h4>
          <p>Rosario, Santa Fe</p>
          <p>info@craneobarbero.com</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <i className="ti ti-brand-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="ti ti-brand-facebook"></i>
            </a>
            <a href="#" aria-label="WhatsApp">
              <i className="ti ti-brand-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Barbería Cráneo Barbero. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
