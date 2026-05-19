import { useState } from "react";

function BranchSelector({ branches, onSelectBranch }) {
   const [selected, setSelected] = useState(null); 

  const mapedBranches = branches.map((branch) => {
    return (
      <button
        className={
          selected === branch.id
                  ? "btn btn-warning text-dark w-100 p-1"
                  : "btn btn-outline-warning text-dark w-100 p-1"
              }
        key={branch.id}
        onClick={() => {setSelected(branch.id); onSelectBranch(branch.id)}}
      >
        {branch.name}
      </button>
    );
  });

 

  return (
    <div className="mt-4">
      <h5 className="text-warning mb-3 text-dark">Seleccioná una sucursal:</h5>
      <div className="d-flex gap-2">{mapedBranches}</div>
    </div>
  );
}

export default BranchSelector;
