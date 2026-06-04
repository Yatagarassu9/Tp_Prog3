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
            ? "btn btn-warning text-white w-100 p-3"
            : "btn btn-dark text-white w-100 p-3"
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
