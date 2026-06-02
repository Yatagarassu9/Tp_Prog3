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
    <div style={{ marginTop: "4rem" }}>
      <h5 className="section-title">Seleccioná una sucursal:</h5>
      <Row className="g-5">{mapedBranches}</Row>
    </div>
  );
}

export default BranchSelector;
