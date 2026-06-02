import { useState, useEffect } from "react";

// custom hook para Barbers 

function useBarbers() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/barbers")
      .then((res) => res.json())
      .then((data) => setBarbers(data));
  }, []);

  return barbers;
}

export default useBarbers;
