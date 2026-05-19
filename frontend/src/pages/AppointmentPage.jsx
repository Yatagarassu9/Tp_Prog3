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
import timeSlots from "../data/timeSlots";

function AppointmentPage() {
  const [branch, setBranch] = useState(null);
  const [barber, setBarber] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);

  const handleSelectBranch = (branchId) => {
    setBranch(branchId);
  };

  const handleSelectBarber = (barberId) => {
    setBarber(barberId);
  };

  const handleSelectDay = (day) => {
    setDay(day);
  };

  const handleSelectHour = (hours) => {
    setHour(hours);
  };

  const filteredBarbers = barbers.filter((barber) => {
    if (!branch) return true;
    return barber.branchId === branch;
  }); // filtro los barberos segun la sucursal seleccionada antes

  return (
    <div className="container py-4">
      <Navbar></Navbar>
      <hr className="border-warning opacity-50" />
      <BranchSelector
        branches={branches}
        /* branches.js → (import) → AppointmentPage → (prop) → BranchSelector */
        onSelectBranch={handleSelectBranch}
      />
      <p />
      {branch && (
        <BarberList
          barbers={filteredBarbers}
          onSelectBarber={handleSelectBarber}
        />
      )}
      {barber && (
        <Calendar
          selectedBranch={branch}
          selectedBarber={barber}
          onSelectDay={handleSelectDay}
        />
      )}
      {day && (
        <TimeSlots
          hours={timeSlots}
          selectedBranch={branch}
          selectedBarber={barber}
          selectedDay={day}
          onSelectHour={handleSelectHour}
        />
      )}

      {day && hour && (
        <AppointmentForm
          branch={branch}
          barber={barber}
          day={day}
          hours={hour}
        />
      )}
    </div>
  );
}

export default AppointmentPage;
