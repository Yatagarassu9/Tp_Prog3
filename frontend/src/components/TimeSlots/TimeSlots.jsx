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
      .then((slots) => setBookedTimes(Array.isArray(slots) ? slots : []))
      .catch(() => setBookedTimes([]));
  }, [selectedBarber, selectedDay]);

  const mapedHours = hours
    .filter((hour) => !bookedTimes.includes(hour.time))
    .map((hour) => {
      const isSelected = selected === hour.id;
      const className = `btn w-100 p-2 ${isSelected ? "btn-warning text-white" : "btn-dark text-white"}`;

      return (
        <button
          className={className}
          key={hour.id}
          onClick={() => {
            setSelected(hour.id);
            onSelectHour(hour.id);
          }}
        >
          {hour.time}
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
