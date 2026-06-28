import { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";

const barbershop_id = 1;


export default function Book(){

    const { employeeId, setEmployeeId } = useBooking();
    const { serviceId, setServiceId } = useBooking();
    const { startDatetime, setStartDatetime } = useBooking();
    const { endDatetime, setEndDatetime } = useBooking();

}