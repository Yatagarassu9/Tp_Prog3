import { useState, useEffect } from "react";

// custom hook para Barbers

function useBarbers() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/barbers`)
      .then((res) => res.json())
      .then((data) => setBarbers(data))
      .catch((err) => console.error("Error al obtener barberos:", err));
  }, []);

  return barbers;
}

export default useBarbers;
