import { useState, useEffect } from "react";

function useCuts() {
  const [cuts, setCuts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/cuts`)
      .then((res) => res.json())
      .then((data) => setCuts(data))
      .catch((err) => console.error("Error al obtener cortes:", err));
  }, []);

  return cuts;
}

export default useCuts;
