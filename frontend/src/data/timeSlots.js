// lista de horarios disponibles para sacar turno
// la barberia atiende de 8 a 12 y de 15 a 20, con slots cada 30 minutos
// los ids los usamos para identificar cada slot en el selector de horarios
const timeSlots = [
  { id: 1,  time: "08:00" },
  { id: 2,  time: "08:30" },
  { id: 3,  time: "09:00" },
  { id: 4,  time: "09:30" },
  { id: 5,  time: "10:00" },
  { id: 6,  time: "10:30" },
  { id: 7,  time: "11:00" },
  { id: 8,  time: "11:30" },
  { id: 9,  time: "12:00" },
  // aca hay un corte al medio dia, la barberia cierra de 12 a 15
  { id: 10, time: "15:00" },
  { id: 11, time: "15:30" },
  { id: 12, time: "16:00" },
  { id: 13, time: "16:30" },
  { id: 14, time: "17:00" },
  { id: 15, time: "17:30" },
  { id: 16, time: "18:00" },
  { id: 17, time: "18:30" },
  { id: 18, time: "19:00" },
  { id: 19, time: "19:30" },
  { id: 20, time: "20:00" },
];

export default timeSlots;
