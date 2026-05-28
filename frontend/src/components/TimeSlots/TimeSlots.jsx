import { useState } from "react";

function TimeSlots({
  hours,
  selectedBranch,
  selectedBarber,
  selectedDay,
  onSelectHour,
}) {
  const [selected, setSelected] = useState(null);

  const mapedHours = hours.map((hour) => {
    return (
      <button
        className={
          selected === hour.id
            ? "btn btn-warning text-dark m-1"
            : "btn btn-outline-warning text-dark m-1 "
        }
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
      <h5 className="text-warning mb-3 text-dark">Elegí un horario</h5>
      <div className="d-flex gap-2">{mapedHours}</div>
    </div>
  );
}

export default TimeSlots;
