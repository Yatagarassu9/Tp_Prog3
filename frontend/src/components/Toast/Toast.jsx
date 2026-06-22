import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
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
        zIndex: 9999,
        minWidth: "240px",
        maxWidth: "360px",
      }}
    >
      <div
        className={`alert alert-${type} d-flex justify-content-between align-items-center mb-0`}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
      >
        <span style={{ fontSize: "14px" }}>{message}</span>
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
