import { useState } from "react"

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function Calendar ({ selectedBranch, selectedBarber, onSelectDay }) {

  const today = new Date();
  today.setHours(0,0,0,0);

  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  //guarda el mes 

  const [selectedDay, setSelectedDay] = useState(null);
  //guarda el dia 
  
  const prevMonth = () => {
    setCurrent(
      new Date(current.getFullYear(), current.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrent(
      new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  };

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const offset =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;

  const handleDay = (date) => {
    setSelectedDay(date);
    onSelectDay(date);
  };

  return (
    <div>

      <div>
        <button onClick={prevMonth}>{"<"}</button>

        <span>
          {MONTHS[month]} {year}
        </span>

        <button onClick={nextMonth}>{">"}</button>
      </div>

      <div>
        {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map((day) => (
          <div key={day}>{day}</div>
        ))}

        {[...Array(offset)].map((_, i) => (
          <div key={i}></div>
        ))}

        {[...Array(lastDay.getDate())].map((_, i) => {

          const day = i + 1;

          const date = new Date(year, month, day);

          const disabled =
            date < today || date.getDay() === 0;

          const selected =
            selectedDay?.toDateString() === date.toDateString();

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => handleDay(date)}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <p>
          Elegiste: {selectedDay.toLocaleDateString("es-AR")}
        </p>
      )}

    </div>
  );
}

export default Calendar