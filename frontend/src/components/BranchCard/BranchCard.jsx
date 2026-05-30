import { Card, Button } from "react-bootstrap";

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
      <Card.Img height={450} variant="top" src={branch.imageUrl} />
      <Card.Body className="text-white">
        <Card.Title className="text-warning">{branch.name}</Card.Title>
        <p>Dirección: {branch.adress}</p>
        <p>Telefono: {branch.phone}</p>
        <Button variant="warning" className="w-100" onClick={onClick}>
          Seleccionar sucursal
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BranchCard;
