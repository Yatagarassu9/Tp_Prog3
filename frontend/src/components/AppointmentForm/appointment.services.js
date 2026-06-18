const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("barberia-token")}`,
});

export const createAppointmentService = (
  clientId,
  barberId,
  appointmentDate,
  cutId,
  onSuccess,
  onError
) => {
  fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ clientId, barberId, appointmentDate, cutId }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al confirmar el turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};
