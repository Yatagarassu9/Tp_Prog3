import { useState } from "react";
import BarberCard from "../BarberCard/BarberCard";
import { Row } from "react-bootstrap";

function BarberList({ barbers, onSelectBarber }) {
  const [selected, setSelected] = useState(null);

  const mapedBarbers = barbers.map((barber) => {
    return (
      <div className="col-md-3" key={barber.id}>
        <BarberCard
          barber={barber}
          isSelected={selected === barber.id}
          onClick={() => {
            setSelected(barber.id);
            onSelectBarber(barber.id);
          }}
        />
      </div>
    );
  });

  return (
    <div className="mt-4">
      <h5 className="mb-3 text-white">Seleccioná un barbero:</h5>
      <Row className="g-5">{mapedBarbers}</Row>
    </div>
  );
}

export default BarberList;
