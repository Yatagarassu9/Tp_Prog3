export const getBarberAppointmentsService = (onSuccess) => {
  const mock = [
    {
      id: 1,
      appointmentDate: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      status: "pending",
      client: { name: "Matías López", phone: "3411234567" },
      Cut: { name: "Corte clásico" },
      barber: { branchId: 1 },
    },
    {
      id: 2,
      appointmentDate: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      status: "pending",
      client: { name: "Rodrigo Pérez", phone: "3419876543" },
      Cut: { name: "Corte + barba" },
      barber: { branchId: 1 },
    },
    {
      id: 3,
      appointmentDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "completed",
      client: { name: "Franco Giménez", phone: "3415554444" },
      Cut: { name: "Degradé" },
      barber: { branchId: 1 },
    },
  ];

  onSuccess(mock);
};
