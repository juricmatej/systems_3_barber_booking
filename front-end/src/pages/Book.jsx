import { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { API_URL } from "../api/api";


const barbershop_id = 1;


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


    const [step, setStep] = useState(1);

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
          start_datetime: startDatetime,
          end_datetime: endDatetime,
          note: note,
        }),
      });

      
    
    if(res.ok) {
        setMessage("You have successfully booked!");
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
                        <div>
                            <label>Start time</label>
                                 <input type="datetime-local" value={startDatetime} onChange={(e) => setStartDatetime(e.target.value)}/>

                        </div>
                         <div>
                            <label>End time</label>
                                 <input type="datetime-local" value={endDatetime} onChange={(e) => setEndDatetime(e.target.value)}/>

                        </div>

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
                                 <input type="email" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}/>

                        </div>
                         <div>
                            <label>note</label>
                                 <input type="email" value={note} onChange={(e) => setNote(e.target.value)}/>

                        </div>

                    <button onClick={() => setStep(3)}>Go Back</button>
                    <button onClick={Submit}>Book !</button>

                </section>

            )}

        </main>


    );
    
    


}


