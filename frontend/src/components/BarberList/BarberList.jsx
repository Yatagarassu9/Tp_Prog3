import { useState } from "react";

function BarberList({ barbers, onSelectBarber }) {
  const mapedBarbers = barbers.map((barber) => {
    return (
      <button key={barber.id} onClick={() => onSelectBarber(barber.id)}
      >
        {barber.name}
      </button>
    );
  });

  return <div>{mapedBarbers}</div>;
}

export default BarberList;
