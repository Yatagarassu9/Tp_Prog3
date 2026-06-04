import { Card, Button } from "react-bootstrap";
import "../../styles/appointment.css";

function BarberCard({ isSelected, barber, onClick }) {
  return (
    <Card
      className={`bg-black shadow-lg rounded-4 ${isSelected ? "border-warning border-4" : "border-0"}`}
      style={
        isSelected
          ? {
              boxShadow: "0 0 15px rgba(255, 193, 7, 0.8)",
              transform: "scale(1.05)",
            }
          : {}
      }
    >
      <Card.Img style={{width: "100%", height:"auto", objectPosition: "top"}} variant="top" src={barber.imageUrl} />
      <Card.Body className="card-body-custom">
        <Card.Title className="text-warning">{barber.name}</Card.Title>
        <p>Años de experiencia: {barber.yearsOfExperience}</p>
        <p>Telefono: {barber.phone}</p>
        <Button variant="warning" className="w-100" onClick={onClick}>
          Seleccionar barbero
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BarberCard;
