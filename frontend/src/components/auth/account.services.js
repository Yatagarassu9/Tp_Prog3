const BASE_URL = "http://localhost:3000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("barberia-token")}`
});

export const changePasswordService = (userId, newPassword, onSuccess, onError) => {
  fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ password: newPassword })
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

export const getMyAppointmentsService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/my`, {
    headers: authHeaders()
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

export const cancelAppointmentService = (appointmentId, onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status: "cancelled" })
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cancelar turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

export const updateAppointmentService = (appointmentId, appointmentDate, onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ appointmentDate })
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al modificar turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};
