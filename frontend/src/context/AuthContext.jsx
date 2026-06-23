import { createContext, useContext, useState, useEffect } from "react";

// creamos el contexto de autenticacion
// esto nos permite compartir el usuario logueado en toda la app sin pasar props de padre a hijo
const AuthContext = createContext(null);

// funcion para decodificar el token JWT y obtener los datos del usuario
// el escape + decodeURIComponent resuelve problemas con caracteres especiales (acentos, etc)
// sin esto los nombres con acentos se mostraban mal
function decodeToken(token) {
  try {
    const payload = token.split(".")[1]; // el JWT tiene 3 partes separadas por puntos, la del medio es el payload
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null; // si el token esta roto o mal formado devolvemos null
  }
}


// proveedor del contexto de auth, envuelve toda la app en App.jsx
// cualquier componente dentro puede usar useAuth() para acceder al usuario
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // al cargar la app verificamos si hay un token guardado en localStorage
  // si existe y no vencio, seteamos el usuario automaticamente (para no perder la sesion al refrescar)
  useEffect(() => {
    const token = localStorage.getItem("barberia-token");
    if (token) {
      const decoded = decodeToken(token);
      // exp esta en segundos, Date.now() en milisegundos, por eso multiplicamos por 1000
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        // si el token vencio lo eliminamos del storage
        localStorage.removeItem("barberia-token");
      }
    }
  }, []);

  // guardamos el token en localStorage y actualizamos el estado del usuario
  const login = (token) => {
    localStorage.setItem("barberia-token", token);
    setUser(decodeToken(token));
  };

  // borramos el token y limpiamos el estado, el usuario queda deslogueado
  const logout = () => {
    localStorage.removeItem("barberia-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook personalizado para usar el contexto de auth en cualquier componente
// en vez de escribir useContext(AuthContext) cada vez, usamos useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
