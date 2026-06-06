import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// escape + decodeURIComponent alrededor del atob resuelve el problema de encoding con caracteres especiales en JWT
// el primer error que vimos era nombres con acentos, no salian y aparecía mal
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("barberia-token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        localStorage.removeItem("barberia-token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("barberia-token", token);
    setUser(decodeToken(token));
  };

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

export function useAuth() {
  return useContext(AuthContext);
}
