const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("barberia-token")}`,
});

export const getBarberAppointmentsService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments`, {
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
