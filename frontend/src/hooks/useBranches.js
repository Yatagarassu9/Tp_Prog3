import { useState, useEffect } from "react";

// custom hook para Barbers 

function useBranches() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/branches`)
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  return branches;
}

export default useBranches;