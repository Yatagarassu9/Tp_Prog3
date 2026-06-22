// modal genérico de confirmación, lo usamos en lugar del window.confirm del navegador
// recibe un título, un mensaje, y dos funciones: una para confirmar y otra para cancelar
function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Confirmar", confirmClass = "btn-agenda-cancel" }) {
  return (
    // si hacemos click fuera del cuadro se cancela
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h3 className="modal-title">{title}</h3>

        {/* mensaje descriptivo de lo que se está por hacer */}
        {message && <p className="modal-hint">{message}</p>}

        {/* botones de acción */}
        <div className="modal-actions">
          <button className={confirmClass} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="modal-close" onClick={onCancel}>
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;
