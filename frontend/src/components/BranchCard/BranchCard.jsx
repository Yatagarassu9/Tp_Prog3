import { Card, Button } from "react-bootstrap";
import "../../styles/appointment.css";

function BranchCard({ branch, isSelected, onClick }) {
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
      <Card.Body className="card-body-custom">
        <Card.Title className="text-warning">{branch.name}</Card.Title>
        <p >Dirección: {branch.address}</p>
        <p>Telefono: {branch.phone}</p>
        <Button variant="outline-warning" className="w-100" onClick={onClick}>
          Seleccionar sucursal
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BranchCard;
