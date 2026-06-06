export const getBarberAppointmentsService = (onSuccess) => {
  const mock = [
    {
      id: 1,
      appointmentDate: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      status: "pending",
      client: { name: "Matías López" },
      Cut: { name: "Corte clásico" },
      barber: { branchId: 1 },
    },
    {
      id: 2,
      appointmentDate: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      status: "pending",
      client: { name: "Rodrigo Pérez" },
      Cut: { name: "Corte + barba" },
      barber: { branchId: 1 },
    },
    {
      id: 3,
      appointmentDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "completed",
      client: { name: "Franco Giménez" },
      Cut: { name: "Degradé" },
      barber: { branchId: 1 },
    },
  ];

  onSuccess(mock);
};
