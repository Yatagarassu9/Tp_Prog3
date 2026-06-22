import { useEffect } from "react";

// componente de notificacion temporal (toast)
// aparece abajo a la derecha de la pantalla y se cierra solo despues de 3 segundos
// type puede ser "success", "danger", "warning", etc (son las clases de bootstrap)
function Toast({ message, type = "success", onClose }) {

  // timer que llama a onClose automaticamente a los 3 segundos
  // el return limpia el timer si el componente se desmonta antes de que se cumpla el tiempo
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999, // tiene que estar por encima de todo, incluso los modales
        minWidth: "240px",
        maxWidth: "360px",
      }}
    >
      <div
        className={`alert alert-${type} d-flex justify-content-between align-items-center mb-0`}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
      >
        <span style={{ fontSize: "14px" }}>{message}</span>
        {/* boton para cerrar el toast manualmente */}
        <button
          type="button"
          className="btn-close btn-close-white ms-3"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default Toast;
