const BASE_URL = import.meta.env.VITE_API_URL;

const parseErrorMessage = async (res, fallback) => {
  try {
    const data = await res.json();
    return data.error || fallback;
  } catch (_) {
    return fallback;
  }
};

export const loginService = (email, password, onSuccess, onError) => {
  fetch(`${BASE_URL}/auth/login`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ email, password })
  })
    .then(async (res) => {
      if (!res.ok) {
        const msg = await parseErrorMessage(res, "Credenciales incorrectas");
        throw new Error(msg);
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
        const msg = await parseErrorMessage(res, "Error al registrar");
        throw new Error(msg);
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};
