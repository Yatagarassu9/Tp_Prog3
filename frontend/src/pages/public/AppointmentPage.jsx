import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
import BarberCard from "../../components/BarberCard/BarberCard";
import BarberList from "../../components/BarberList/BarberList";
import BranchSelector from "../../components/BranchSelector/BranchSelector";
import Calendar from "../../components/Calendar/Calendar";
import TimeSlots from "../../components/TimeSlots/TimeSlots";
import CutSelector from "../../components/CutSelector/CutSelector";
import timeSlots from "../../data/timeSlots";
import "../../styles/appointment.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "react-bootstrap";
import useBranches from "../../hooks/useBranches.js";
import useBarbers from "../../hooks/useBarbers.js";
import useCuts from "../../hooks/useCuts.js";

function AppointmentPage() {
  const location = useLocation();
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
  const [selectedCut, setSelectedCut] = useState(null);
  const branches = useBranches();
  const barbers = useBarbers();
  const cuts = useCuts();
  const [selectedBranch, setSelectedBranch] = useState(location.state?.branchId ?? null);
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
    setSelectedCut(null);
  };

  const handleSelectDay = (day) => {
    setDay(day);
    setSelectedCut(null);
    setHour(null);
  };

  const handleSelectCut = (cutId) => {
    setSelectedCut(cutId);
    setHour(null);
  };

  const handleSelectHour = (hours) => {
    setHour(hours);
  };

  const filteredBarbers = barbers.filter((barber) => {
    if (!selectedBranch) return true;
    return barber.branchId === selectedBranch;
  }); // filtro los barberos segun la sucursal seleccionada antes

  useEffect(() => {
    document.title = " Sacar turno | Cráneo Barbero";
  }, []);

  return (
    <div className="appointment-page-bg page-transition">
      <hr className="border-warning opacity-50" />
      {/* <Button variant="outline-warning" onClick={() => navigate("/")}>
        Ir al inicio
      </Button> */}
      <BranchSelector
        branches={branches}
        onSelectBranch={handleSelectBranch}
        initialSelected={selectedBranch}
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
        <CutSelector cuts={cuts} onSelectCut={handleSelectCut} />
      )}

      {day && selectedCut && (
        <TimeSlots
          hours={timeSlots}
          key={selectedBarber + day}
          selectedBranch={selectedBranch}
          selectedBarber={selectedBarber}
          selectedDay={day}
          onSelectHour={handleSelectHour}
        />
      )}

      {day && selectedCut && hour && (
        <AppointmentForm
          branch={selectedBranch}
          barber={selectedBarber}
          day={day}
          hours={hour}
          cut={selectedCut}
          branches={branches}
          barbers={barbers}
          cuts={cuts}
          timeSlots={timeSlots}
        />
      )}
    </div>
  );
}

export default AppointmentPage;
