import { useRef, useState } from "react";
import { registerService } from "./auth.services";

const Register = ({ onRegister, onCancel }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setErrors] = useState({ name: false, email: false, password: false, confirmPassword: false });
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const clearError = (field) => {
        setErrors((prev) => ({ ...prev, [field]: false }));
        setServerError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name.trim()) {
            setErrors({ ...error, name: true });
            nameRef.current.focus();
            return;
        }
        if (!email.trim()) {
            setErrors({ ...error, email: true });
            emailRef.current.focus();
            return;
        }
        if (password.length < 7) {
            setErrors({ ...error, password: true });
            passwordRef.current.focus();
            return;
        }
        if (password !== confirmPassword) {
            setErrors({ ...error, confirmPassword: true });
            confirmPasswordRef.current.focus();
            return;
        }

        setLoading(true);
        registerService(
            name,
            email,
            password,
            () => {
                setLoading(false);
                onRegister();
            },
            (err) => {
                setServerError(err.message);
                setLoading(false);
            }
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className="text-warning mb-4">Creá tu cuenta para confirmar el turno</p>

            <div className="mb-3">
                <input
                    type="text"
                    required
                    ref={nameRef}
                    placeholder="Nombre completo"
                    onChange={(e) => { setName(e.target.value); clearError("name"); }}
                    value={name}
                    className={`form-control bg-secondary text-white border-${error.name ? "danger" : "secondary"}`}
                />
                {error.name && (
                    <p className="text-danger" style={{ fontSize: "13px", marginTop: "4px" }}>
                        Por favor ingresá tu nombre.
                    </p>
                )}
            </div>

            <div className="mb-3">
                <input
                    type="email"
                    required
                    ref={emailRef}
                    placeholder="Email"
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    value={email}
                    className={`form-control bg-secondary text-white border-${error.email ? "danger" : "secondary"}`}
                />
                {error.email && (
                    <p className="text-danger" style={{ fontSize: "13px", marginTop: "4px" }}>
                        Por favor ingresá tu email.
                    </p>
                )}
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    required
                    ref={passwordRef}
                    placeholder="Contraseña (mínimo 7 caracteres)"
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    value={password}
                    className={`form-control bg-secondary text-white border-${error.password ? "danger" : "secondary"}`}
                />
                {error.password && (
                    <p className="text-danger" style={{ fontSize: "13px", marginTop: "4px" }}>
                        La contraseña debe tener al menos 7 caracteres.
                    </p>
                )}
            </div>

            <div className="mb-4">
                <input
                    type="password"
                    required
                    ref={confirmPasswordRef}
                    placeholder="Repetir contraseña"
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                    value={confirmPassword}
                    className={`form-control bg-secondary text-white border-${error.confirmPassword ? "danger" : "secondary"}`}
                />
                {error.confirmPassword && (
                    <p className="text-danger" style={{ fontSize: "13px", marginTop: "4px" }}>
                        Las contraseñas no coinciden.
                    </p>
                )}
            </div>

            {serverError && (
                <p className="text-danger text-center mb-3" style={{ fontSize: "14px" }}>
                    {serverError}
                </p>
            )}

            <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={onCancel} disabled={loading}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-warning text-dark w-100" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
            </div>
        </form>
    );
};

export default Register;
