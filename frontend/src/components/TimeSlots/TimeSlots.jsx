import { useState, useEffect } from "react";
import { getBookedSlotsService } from "../AppointmentForm/appointment.services";

function TimeSlots({
  hours,
  selectedBranch,
  selectedBarber,
  selectedDay,
  onSelectHour,
}) {
  const [selected, setSelected] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);

  useEffect(() => {
    if (!selectedBarber || !selectedDay) return;
    getBookedSlotsService(selectedBarber, selectedDay)
      .then((slots) => setBookedTimes(slots))
      .catch(() => setBookedTimes([]));
  }, [selectedBarber, selectedDay]);

  const mapedHours = hours.map((hour) => {
    const isBooked = bookedTimes.includes(hour.time);
    const isSelected = selected === hour.id;

    let className = "btn w-100 p-2 ";
    if (isBooked) {
      className += "btn-secondary text-white opacity-75";
    } else if (isSelected) {
      className += "btn-warning text-white";
    } else {
      className += "btn-dark text-white";
    }

    return (
      <button
        className={className}
        key={hour.id}
        disabled={isBooked}
        onClick={() => {
          setSelected(hour.id);
          onSelectHour(hour.id);
        }}
        title={isBooked ? "Turno ocupado" : ""}
      >
        {hour.time}
        {isBooked && (
          <span
            style={{ display: "block", fontSize: "0.65rem", lineHeight: 1 }}
          >
            Ocupado
          </span>
        )}
      </button>
    );
  });

  return (
    <div className="mt-4">
      <h5 className="btn-dark text-white w-100 p-1 mb-3">Elegí un horario</h5>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, auto)",
          gap: "8px",
        }}
      >
        {mapedHours}
      </div>
    </div>
  );
}

export default TimeSlots;
