import Navbar from "../components/Navbar/Navbar";
import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import BarberCard from "../components/BarberCard/BarberCard";
import BarberList from "../components/BarberList/BarberList";
import BranchSelector from "../components/BranchSelector/BranchSelector";
import Calendar from "../components/Calendar/Calendar";
import TimeSlots from "../components/TimeSlots/TimeSlots";
import { useState } from "react";
import branches from "../data/branches";
import barbers from "../data/barbers";


function AppointmentPage() {
  const [branch, setBranch] = useState(null);
  const [barber, setBarber] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);

  const handleSelectBranch = (branchId) => {
    setBranch(branchId)
  };

  const handleSelectBarber = (barberId) => {
    setBarber(barberId);
  };

  const handleSelectDay = (day) => {
    setDay(day);
  };

  const handleSelectHour = (hour) => {
    setHour(hour);
  };

   const filteredBarbers = barbers.filter((barber) => {
    if (!branch) return true
    return (
      barber.branchId === branch
    )
  }); // filtro los barberos segun la sucursal seleccionada antes


  return (
    <div>
      <BranchSelector
        branches={branches}
        /* branches.js → (import) → AppointmentPage → (prop) → BranchSelector */
        onSelectBranch={handleSelectBranch}
      />
      <p/>
      <BarberList
        barbers={filteredBarbers}
        onSelectBarber={handleSelectBarber}
      />
      
      <Calendar
        selectedBranch={branch}
        selectedBarber={barber}
        onSelectedDay={handleSelectDay}

      />
      {day && (
        <AppointmentForm
        branch={branch}
        barber={barber}
        day={day}
        hour={hour}
        />
      )}
      {day && hour && (
        <AppointmentForm
        branch={branch}
        barber={barber}
        day={day}
        hour={hour}
        />
      )}
      
    </div>
  );
}

export default AppointmentPage;
