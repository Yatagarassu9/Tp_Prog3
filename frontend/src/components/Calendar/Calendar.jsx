import { useState } from "react";

// nombres de los meses en español para mostrar en el encabezado del calendario
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// componente de calendario para elegir el dia del turno
// recibe la sucursal y barbero seleccionados (aunque no los usa directamente)
// y una funcion onSelectDay que se llama cuando el usuario elige un dia
function Calendar({ selectedBranch, selectedBarber, onSelectDay }) {
  // today con la hora en 00:00:00 para poder comparar solo fechas sin importar la hora
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // current guarda el primer dia del mes que estamos viendo en el calendario
  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDay, setSelectedDay] = useState(null);

  // navegacion entre meses, resta o suma 1 al mes actual
  const prevMonth = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const year = current.getFullYear();
  const month = current.getMonth();

  // primer y ultimo dia del mes para saber cuantos dias renderizar
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // calculamos cuantos espacios vacios poner antes del primer dia del mes
  // en nuestro calendario la semana arranca el lunes (no el domingo como en EEUU)
  // getDay() devuelve 0 para domingo, entonces si es domingo lo tratamos como 6 (ultimo dia)
  const offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // cuando el usuario hace click en un dia lo guardamos y avisamos al padre
  const handleDay = (date) => {
    setSelectedDay(date);
    onSelectDay(date);
  };

  return (
    <div className="mt-4">
      <h5 className="text-white p-2 rounded mb-3 d-inline-block">
        Elegí un día:
      </h5>

      {/* controles para cambiar de mes */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <button
          className="btn btn-outline-warning m-1 text-white"
          onClick={prevMonth}
        >
          {"<"}
        </button>

        <span className="bg-dark text-white">
          {MONTHS[month]} {year}
        </span>

        <button
          className="btn btn-outline-warning m-1 text-white"
          onClick={nextMonth}
        >
          {">"}
        </button>
      </div>

      {/* grilla de dias, 7 columnas para los 7 dias de la semana */}
      <div
        className="text-center fw-bold d-grid"
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {/* encabezados de los dias de la semana */}
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
          <div className="text-warning text-center fw-bold" key={day}>
            {day}
          </div>
        ))}

        {/* celdas vacias para alinear el primer dia en la columna correcta */}
        {[...Array(offset)].map((_, i) => (
          <div key={i}></div>
        ))}

        {/* renderizamos cada dia del mes */}
        {[...Array(lastDay.getDate())].map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);

          // deshabilitamos dias pasados, domingos (0) y lunes (1)
          // la barberia no trabaja domingos ni lunes
          const disabled = date < today || date.getDay() === 0 || date.getDay() === 1;

          const selected = selectedDay?.toDateString() === date.toDateString();

          return (
            <button
              className={
                selected
                  ? "btn btn-warning text-dark fw-bold w-100 p-2"
                  : disabled
                  ? "btn btn-dark text-secondary w-100 p-2"
                  : "btn btn-outline-warning text-warning w-100 p-2"
              }
              key={day}
              disabled={disabled}
              onClick={() => handleDay(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
