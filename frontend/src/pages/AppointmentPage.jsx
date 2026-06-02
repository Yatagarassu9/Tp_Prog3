import Navbar from "../components/Navbar/Navbar";
import AppointmentForm from "../components/AppointmentForm/AppointmentForm";
import BarberCard from "../components/BarberCard/BarberCard";
import BarberList from "../components/BarberList/BarberList";
import BranchSelector from "../components/BranchSelector/BranchSelector";
import Calendar from "../components/Calendar/Calendar";
import TimeSlots from "../components/TimeSlots/TimeSlots";
import timeSlots from "../data/timeSlots";
import "../styles/appointment.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import useBranches from "../hooks/useBranches.js";
import useBarbers from "../hooks/useBarbers.js";

function AppointmentPage() {
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
  const branches = useBranches();
  const barbers = useBarbers();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const navigate = useNavigate();

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
    <div className="appointment-page-bg page-transition">
      <Navbar></Navbar>
      <hr className="border-warning opacity-50" />
      <Button variant="outline-warning" onClick={() => navigate("/")}>
        Ir al inicio
      </Button>
      <BranchSelector
        branches={branches}
        /* branches.js - (import) - AppointmentPage - (prop) - BranchSelector */
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
          key={selectedBarber + day} //  el + une los dos valores en un string
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
          branches={branches}
          barbers={barbers}
          timeSlots={timeSlots}
        />
      )}
    </div>
  );
}

export default AppointmentPage;
