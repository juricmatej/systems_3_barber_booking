import { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { API_URL, barbershop_id } from "../api/api";




export default function Book(){

    const { employeeId, setEmployeeId } = useBooking();
    const { serviceId, setServiceId } = useBooking();
    const { startDatetime, setStartDatetime } = useBooking();
    const { endDatetime, setEndDatetime } = useBooking();
    const [ employees, setEmployees] = useState([]);
    const [ services, setServices] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [note, setNote] = useState("");




    const [message, setMessage] = useState("");


    const [selectedDate, setSelectedDate] = useState("");
    const [freeSlots, setFreeSlots] = useState([]);

    const [step, setStep] = useState(1);
    

    function calculateEndTime(start, durationMin) {
         const startDate = new Date(start);
         const endDate = new Date(startDate.getTime() + durationMin * 60000);

         const addZero = (value) => String(value).padStart(2, "0");

         return `${endDate.getFullYear()}-${addZero(endDate.getMonth() + 1)}-${addZero(endDate.getDate())}T${addZero(endDate.getHours())}:${addZero(endDate.getMinutes())}`;
}   






useEffect(() => {
    async function loadData() {
      try {
        const res1 = await fetch(`${API_URL}/employees?barbershop_id=${barbershop_id}`);
        setEmployees(await res1.json());


        const res2 = await fetch(`${API_URL}/services?barbershop_id=${barbershop_id}`);
        setServices(await res2.json());

      } catch (err) {
        console.log("Error loading news:", err);
      }
    }

    loadData();
  }, []);

  useEffect(() => {

    if (!employeeId || !serviceId || !selectedDate) {
        return;
    }


    async function loadData() {
        try {
            const res = await fetch(`${API_URL}/appointments/free?employee_id=${employeeId}&service_id=${serviceId}&date=${selectedDate}`);
            setFreeSlots(await res.json());
        } catch (err) {
            console.log(err);
        }
    }

    loadData();
  }, [employeeId, serviceId, selectedDate]);


  async function Submit() {
    try {
        const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbershop_id: barbershop_id,
          service_id: serviceId,
          employee_id: employeeId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          start_datetime: startDatetime.replace("T", " "),
          end_datetime: endDatetime.replace("T", " "),
          note: note,
        }),
      });

    
    
    if(res.ok) {
        setStep(5);
    } else{
        setMessage("Error in reservation");
    }

    } catch (error) {
      console.log("Error deleting news:", error);
      setMessage("News was not deleted.");
    }
  }

    return (

        <main>

            <h1>Book a cut !</h1>

            {step == 1 && (
                <section>
                    <h1>babrer</h1>
                {employees.map((empl) => (
                    <div key={empl.id}>
                        <h2>{empl.display_name}</h2>
                            <button onClick={() => { 
                                setEmployeeId(empl.id); 
                                setStep(2);
                                }}>
                                Me !
                            </button>
                    </div>
                    
                ) )}

                </section>

            )}
            {step == 2 && (
                <section>
                    <h1>Service</h1>
                {services.map((ser) => (
                    <div key={ser.id}>
                        <h2>{ser.name}</h2>
                        <p>{ser.description}</p>
                        <p>{ser.duration_min} min - {ser.price} € </p>
                            <button onClick={() => { 
                                setServiceId(ser.id); 
                                setStep(3);}}>
                                This
                            </button>
                    </div>
                    
                ) )}
                    <button onClick={() => setStep(1)}>Go Back</button>
                </section>

            )}
              {step == 3 && (
                <section>
                    <h1>Select time and date</h1>
                        
                        <label>Date</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

                         {freeSlots.map((slot) => (
                              <button key={slot.start_datetime} onClick={() => {
                                setStartDatetime(slot.start_datetime);
                                setEndDatetime(slot.end_datetime);
                                setStep(4);
                                  }}
                                                >
                              {slot.start_datetime.slice(11, 16)}
             </button>
        ))}



                    <button onClick={() => setStep(1)}>Go Back</button>
                    <button onClick={() => setStep(4)}>Next</button>

                </section>

            )}
            {step == 4 && (
                <section>
                    <h1>Your info</h1>
                        <div>
                            <label>Name and surname *</label>
                                 <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>

                        </div>
                         <div>
                            <label>Email *</label>
                                 <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}/>

                        </div>
                         <div>
                            <label>Phone</label>
                                 <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}/>

                        </div>
                         <div>
                            <label>note</label>
                                 <input type="text" value={note} onChange={(e) => setNote(e.target.value)}/>

                        </div>

                    <button onClick={() => setStep(3)}>Go Back</button>
                    <button onClick={Submit}>Book !</button>

                </section>

            )}
            {step == 5 && (
                <section>
                    <h1>Reservation Booked !</h1>
                        <div>
                                <p>Barber: {employees.find((empl) => empl.id == employeeId)?.display_name}</p>
                                <p>Service: {services.find((ser) => ser.id == serviceId)?.name}</p>
                                <p>When: {startDatetime.replace("T", " ")} — {endDatetime.replace("T", " ")}</p>
                                <p>Who: {customerName}</p>
                                <p>Email: {customerEmail}</p>
                        </div>
                        
                </section>

            )}


        </main>


    );
    
    


}


