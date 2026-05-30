import { useState } from "react";
import BranchCard from "../BranchCard/BranchCard";
import { Row } from "react-bootstrap";

function BranchSelector({ branches, onSelectBranch }) {
  const [selected, setSelected] = useState(null);

  const mapedBranches = branches.map((branch) => {
    return (
      <div className="col-md-4" key={branch.id}>
        <BranchCard
          branch={branch}
          isSelected={selected === branch.id}
          onClick={() => {
            setSelected(branch.id);
            onSelectBranch(branch.id);
          }}
        />
      </div>
    );
  });

  return (
    <div className="mt-4">
      <h5 className="text-warning mb-5 text-white fs-2">Seleccioná una sucursal:</h5>
      <Row className="g-3">{mapedBranches}</Row>
    </div>
  );
}

export default BranchSelector;
