import { useState, useEffect } from "react";

// custom hook para Branches

function useBranches() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/branches`)
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error("Error al obtener sucursales:", err));
  }, []);

  return branches;
}

export default useBranches;
