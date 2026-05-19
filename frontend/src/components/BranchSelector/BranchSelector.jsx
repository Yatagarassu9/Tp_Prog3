import { useState } from "react";

function BranchSelector({ branches, onSelectBranch }) {
  const mapedBranches = branches.map((branch) => {
    return (
      <button key={branch.id} onClick={() => onSelectBranch(branch.id)}>
        {branch.name}
      </button>
    );
  });

  return <div>{mapedBranches}</div>;
}

export default BranchSelector;
