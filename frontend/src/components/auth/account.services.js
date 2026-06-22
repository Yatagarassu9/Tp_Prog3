// servicios específicos del cliente autenticado
const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("barberia-token")}`,
});

// trae todos los turnos del cliente que está logueado
export const getMyAppointmentsService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/my`, {
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener turnos");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// cambia la contraseña del usuario
export const changePasswordService = (userId, newPassword, onSuccess, onError) => {
  fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ password: newPassword }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cambiar contraseña");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};
