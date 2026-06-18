import { useState } from "react";

function CutSelector({ cuts, onSelectCut }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mt-4">
      <h5 className="text-white mb-3">Elegí un servicio:</h5>
      <div className="d-flex flex-wrap gap-3">
        {cuts.map((cut) => (
          <button
            key={cut.id}
            className={
              selected === cut.id
                ? "btn btn-warning text-dark fw-bold px-2 py-2"
                : "btn btn-outline-warning text-warning px-2 py-2"
            }
            onClick={() => {
              setSelected(cut.id);
              onSelectCut(cut.id);
            }}
          >
            <div className="fw-bold">{cut.name}</div>
            <div className="small">{cut.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CutSelector;
