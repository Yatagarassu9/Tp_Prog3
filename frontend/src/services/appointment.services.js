// servicios compartidos de turnos
// los usan el cliente, el barber y el superadmin porque todos pegan al mismo endpoint del back
const BASE_URL = import.meta.env.VITE_API_URL;

// armamos los headers con el token guardado en localStorage
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("barberia-token")}`,
});

// cancela un turno cambiando su estado a "cancelled"
// lo usa el cliente desde mis turnos y el barber desde su agenda
export const cancelAppointmentService = (appointmentId, onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status: "cancelled" }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cancelar el turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// modifica la fecha y horario de un turno
// lo usa el cliente desde mis turnos, el barber desde su agenda y el superadmin desde gestionar
export const updateAppointmentService = (appointmentId, appointmentDate, onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ appointmentDate }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al modificar el turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};