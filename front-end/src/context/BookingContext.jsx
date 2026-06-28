import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  return (
    <BookingContext.Provider value={{
      employeeId, setEmployeeId,
      serviceId, setServiceId,
      startDateTime, setStartDateTime,
      endDateTime, setEndDateTime,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}