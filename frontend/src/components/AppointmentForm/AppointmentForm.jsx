import branches from "../../data/branches";
import barbers from "../../data/barbers";
import timeSlots from "../../data/timeSlots";

function AppointmentForm({ branch, barber, day, hours }) {
  const selectedBranch = branches.find((b) => b.id === branch);
  const selectedBarber = barbers.find((barb) => barb.id === barber);
  const selectedHour = timeSlots.find((hour) => hour.id === hours);

  return (
    <div>
      <h1>Turno elegido:</h1>
      <div>Sucursal: {selectedBranch.name}</div>
      <div>Barbero: {selectedBarber.name}</div>
      <div>Fecha: {day.toLocaleDateString("es-AR")}</div>
      <div>Horario: {selectedHour.time}</div>
    </div>
  );
}

export default AppointmentForm;
