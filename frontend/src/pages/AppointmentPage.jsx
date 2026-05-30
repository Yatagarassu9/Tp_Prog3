import Navbar from "../components/Navbar/Navbar";
import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import BarberCard from "../components/BarberCard/BarberCard";
import BarberList from "../components/BarberList/BarberList";
import BranchSelector from "../components/BranchSelector/BranchSelector";
import Calendar from "../components/Calendar/Calendar";
import TimeSlots from "../components/TimeSlots/TimeSlots";
import { useState, useEffect } from "react";
import timeSlots from "../data/timeSlots";

function AppointmentPage() {
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/barbers")
      .then((res) => res.json())
      .then((data) => setBarbers(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  const handleSelectBranch = (branchId) => {
    setSelectedBranch(branchId);
    setSelectedBarber(null);
    setDay(null);
    setHour(null);
  };

  const handleSelectBarber = (barberId) => {
    setSelectedBarber(barberId);
    setDay(null);
    setHour(null);
  };

  const handleSelectDay = (day) => {
    setDay(day);
    setHour(null);
  };

  const handleSelectHour = (hours) => {
    setHour(hours);
  };

  const filteredBarbers = barbers.filter((barber) => {
    if (!selectedBranch) return true;
    return barber.branchId === selectedBranch;
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
      {selectedBranch && (
        <BarberList
          barbers={filteredBarbers}
          onSelectBarber={handleSelectBarber}
        />
      )}
      {selectedBarber && (
        <Calendar
         key={selectedBarber}
          selectedBranch={selectedBranch}
          selectedBarber={selectedBarber}
          onSelectDay={handleSelectDay}
        />
      )}
      {day && (
        <TimeSlots
          hours={timeSlots}
          key={selectedBarber + selectedDay} //  el + une los dos valores en un string
          selectedBranch={selectedBranch}
          selectedBarber={selectedBarber}
          selectedDay={day}
          onSelectHour={handleSelectHour}
        />
      )}

      {day && hour && (
        <AppointmentForm
          branch={selectedBranch}
          barber={selectedBarber}
          day={day}
          hours={hour}
        />
      )}
    </div>
  );
}

export default AppointmentPage;
