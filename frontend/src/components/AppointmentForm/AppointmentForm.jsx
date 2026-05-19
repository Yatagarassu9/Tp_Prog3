import branches from "../../data/branches";
import barbers from "../../data/barbers";
import timeSlots from "../../data/timeSlots";

function AppointmentForm({ branch, barber, day, hours }) {
  const selectedBranch = branches.find((b) => b.id === branch);
  const selectedBarber = barbers.find((barb) => barb.id === barber);
  const selectedHour = timeSlots.find((hour) => hour.id === hours);

  return (
    <div className="card bg-dark border-warning mt-4 p-4">
      <h5 className="text-warning mb-3">Turno elegido:</h5>
      <div className="text-light mb-1">Sucursal: {selectedBranch.name}</div>
      <div className="text-light mb-1">Barbero: {selectedBarber.name}</div>
      <div className="text-light mb-1">
        Fecha: {day.toLocaleDateString("es-AR")}
      </div>
      <div className="text-light mb-1">Horario: {selectedHour.time}</div>
      <button className="btn btn-warning text-dark mt-3 w-100">
        Confirmar Turno
      </button>
    </div>
  );
}

export default AppointmentForm;
