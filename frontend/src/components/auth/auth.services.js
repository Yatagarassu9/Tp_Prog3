const BASE_URL = import.meta.env.VITE_API_URL;

export const loginService = (email, password, onSuccess, onError) => {
  fetch(`${BASE_URL}/auth/login`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ email, password })
  })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Credenciales incorrectas");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

export const registerService = (name, email, password, onSuccess, onError) => {
  fetch(`${BASE_URL}/auth/register`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ name, email, password })
  })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al registrar");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};
