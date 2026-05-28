import { useState } from "react";

function BarberList({ barbers, onSelectBarber }) {
  const [selected, setSelected] = useState(null);

  const mapedBarbers = barbers.map((barber) => {
    return (
      <button
        className={
          selected === barber.id
            ? "btn btn-warning text-dark m-1"
            : "btn btn-outline-warning text-dark m-1 "
        }
        key={barber.id}
        onClick={() => {
          setSelected(barber.id);
          onSelectBarber(barber.id);
        }}
      >
        {barber.name}
      </button>
    );
  });

  return (
    <div className="mt-4">
      <h5 className="mb-3 text-dark">Seleccioná un barbero:</h5>
      <div className="d-flex gap-2">{mapedBarbers}</div>
    </div>
  );
}

export default BarberList;
