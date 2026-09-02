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



    const [slota, setSlota] = useState(null);
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
          customer_phone: customerPhone.replace(/\D/g, ""), //everything that is not a number gets cut 
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

            <h1 className="center-texts">Book a cut !</h1>

            {step == 1 && (
                <section>
                    <h1>Select a barber:</h1>
                {employees.map((empl) => (
                    <div className="boxed-like-a-fish" key={empl.id}>
                        <h2>{empl.display_name}</h2>
                            <button className="btn btn-primary btn-lg" onClick={() => { 
                                setEmployeeId(empl.id); 
                                setStep(2);
                                }}> 
                            Choose
                            </button>
                    </div>
                    
                ) )}

                </section>

            )}
            {step == 2 && (
                <section>
                    <h1>Services</h1>
                {services.map((ser) => (
                    <div className="boxed-like-a-fish" key={ser.id}>
                        <div className="service-left">
                        <h2>{ser.name}</h2>
                        <p>{ser.description}</p>
                        </div>
                        <div className="service-right">
                            <div className="price">
                        <p>{ser.duration_min} min - {ser.price} € </p>
                        </div>
                            <button className="btn btn-primary"  onClick={() => { 
                                setServiceId(ser.id); 
                                setStep(3);}}>
                                Choose
                            </button>
                            </div>
                    </div>
                    
                ) )}
                    <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}>Go Back</button>
                </section>

            )}
              {step == 3 && (
                <section>
                    <h1>Select time and date</h1>
                        
                        <label>Date selection:</label>
                        <br></br>
                        <input type="date" min={new Date().toISOString().slice(0, 10)} value={selectedDate} onChange={(e) => {
                            setSelectedDate(e.target.value);
                             setSlota(null);
              }} />

                         <div className="time-slots">
                         {freeSlots.map((slot) => (
                              <button key={slot.start_datetime} className={slota?.start_datetime == slot.start_datetime ? "selected" : ""} 
                              onClick={() => setSlota(slot)}

                                
                                                >
                              {slot.start_datetime.slice(11, 16)}
             </button>

        ))}
        </div>

              {selectedDate && freeSlots.length == 0 &&(
                <p>There are no free slots for this date!</p>
              )}



                    <button className="secondary" onClick={() => setStep(2)}>Go Back</button>
                    <button onClick={() => { setStartDatetime(slota.start_datetime);
                                setEndDatetime(slota.end_datetime);
                        setStep(4)}} disabled={!slota} >Next</button>

                </section>

            )}
            {step == 4 && (
                <section>
                    <h1>Your Information</h1>
                        <div>
                            <label>Name *</label>
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
                            <label>Note</label>
                                 <input type="text" value={note} onChange={(e) => setNote(e.target.value)}/>

                        </div>

                    <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Go Back</button>
                    <button  className="btn btn-primary btn-lg" onClick={Submit}>Book !</button>

                </section>

            )}
            {step == 5 && (
                <section>
                    <h1>Reservation Booked !</h1>
                        <div>

                                <div className="boxed">

                                <div className="boxed-left"> 
                                <h3>{employees.find((empl) => empl.id == employeeId)?.display_name}</h3>
                                <p>Service: {services.find((ser) => ser.id == serviceId)?.name}</p>
                                </div>   
                                <div className="customer-info">

                              
                                <p><strong>Who:</strong> {customerName}</p>
                                {customerEmail && <p> <strong>Email:</strong> {customerEmail}</p>}
                                {customerPhone && <p><strong>Phone:</strong>{customerPhone}</p>}
                                </div>
                                <div className="boxed-right">
                                  <p id="date">{startDatetime.split(" ")[0]}</p>
                                  <p> {startDatetime.split(" ")[1].slice(0, 5)}-{endDatetime.split(" ")[1].slice(0, 5)}</p>
                                </div>
                           
                              
                                </div>
                                 


                        </div>
                        
                </section>

            )}


        </main>


    );
    
    


}


