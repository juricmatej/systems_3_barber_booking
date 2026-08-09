import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  return (
    <BookingContext.Provider value={{
      employeeId, setEmployeeId,
      serviceId, setServiceId,
      startDatetime, setStartDatetime,
      endDatetime, setEndDatetime,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}