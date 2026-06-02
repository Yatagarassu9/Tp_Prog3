import { useState } from "react";
import "./App.css";
import AppointmentPage from "./pages/AppointmentPage";
import BarberDashboardPage from "./pages/BarberDashboardPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/appointment" element={<AppointmentPage/>}></Route>
          <Route path="/barber" element={<BarberDashboardPage/>}></Route>
        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;
