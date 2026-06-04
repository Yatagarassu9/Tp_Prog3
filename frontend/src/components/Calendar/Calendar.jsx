import { useState } from "react";

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

function Calendar({ selectedBranch, selectedBarber, onSelectDay }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  //guarda el mes

  const [selectedDay, setSelectedDay] = useState(null);
  //guarda el dia

  const prevMonth = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const handleDay = (date) => {
    setSelectedDay(date);
    onSelectDay(date);
  };

  return (
    <div className="mt-4">
      <h5 className="text-white p-2 rounded mb-3 d-inline-block">
        Elegí un día:
      </h5>
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

      <div
        className="text-center fw-bold d-grid"
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {/* divide el contenedor en 7 columnas de igual tamaño. 1fr es fraccion del espacio disponible */}
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
          <div className="text-warning text-center fw-bold" key={day}>
            {day}
          </div>
        ))}

        {[...Array(offset)].map((_, i) => (
          <div key={i}></div>
        ))}

        {[...Array(lastDay.getDate())].map((_, i) => {
          const day = i + 1;

          const date = new Date(year, month, day);

          const disabled = date < today || date.getDay() === 0;

          const selected = selectedDay?.toDateString() === date.toDateString();

          return (
            <button
              className={
                selected
                  ? "btn btn-warning text-white w-100 p-3"
                  : "btn btn-dark text-white w-100 p-3"
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
