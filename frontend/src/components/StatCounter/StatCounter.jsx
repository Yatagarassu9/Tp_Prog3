import { useState, useEffect, useRef } from "react";

function StatCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = value / 150; /* 60 pasos es 16ms - 1seg aprox */ 
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);


/* new IntersectionObserver(callback, options) - API del browser que detecta cuándo un elemento entra o sale de la pantalla. Recibe una función que se ejecuta cuando cambia la visibilidad

([entry]) - el Observer siempre llama al callback con un array de entradas. El [ ] es desestructuración para agarrar solo la primera directamente

entry.isIntersecting - booleano, true cuando el elemento está visible en pantalla

threshold: 0.5 - el Observer dispara cuando el 50% del elemento es visible

observer.disconnect() - deja de observar el elemento. Lo hacés para que la animación solo corra una vez

value / 60 - divide el valor total en 60 pasos

setInterval(..., 16) - ejecuta la función cada 16ms, que es aproximadamente 60 veces por segundo (60fps)

return () => observer.disconnect() - función de limpieza del useEffect. React la ejecuta cuando el componente se desmonta para no dejar observers colgados

{...stat} en HomePage - spread operator, equivale a escribir value={stat.value} suffix={stat.suffix} label={stat.label} individualmente */

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default StatCounter;