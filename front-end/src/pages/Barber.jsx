import { API_URL } from "../api/api";
import { useState, useEffect } from "react";


const dayNames = ["", "Monday", "Tuesday", "Wednsday", "Thursday", "Firday", "Sunday", "Saturday"];
  

  //  const { employeeId, setEmployeeId } = useBooking();
    const [schedule, setSchedule] = useState([]); 
    //const { startDatetime, setStartDatetime } = useBooking();
  //  const { endDatetime, setEndDatetime } = useBooking();
    const [ employee, setEmployee] = useState(null);
    const [ services, setServices] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [note, setNote] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [newTimeOffStart, setNewTimeOffStart] = useState("");
    const [newTimeOffEnd, setNewTimeOffEnd] = useState("");
    const [newTimeOffReason, setNewTimeOffReason] = useState("");
    const [timeOff, setTimeOff] = useState([]);

    
    
    const [message, setMessage] = useState("");
    
    
    const [step, setStep] = useState(1);

export default function Barber() {
    
    useEffect(() => {
        async function loadData() {
            try {
              const res = await fetch(`${API_URL}/employees/me`,
             { credentials: "include" });
              const data = await res.json();

              if (res.ok) {
                setEmployee(data);
              }else {
                setMessage(data.message || "employee not foiund");
              }
            } catch (err) {
                console.log("Error loading news:", err);
            }
          
        }

        loadData;
    }, []);

    useEffect(() => {
        if(!employee){
            return;

        };
        
        loadAppointments();
        loadSchedule();
        loadTimeOff();

    }, {employee});



    async function loadAppointments() {
        try {
            const res = await fetch(`${API_URL}/appointments/employee/${employee.id}`,
                {credentials: "include", });

                setAppointments(await res.json());
      
        } catch (error) {
            console.log(error)
        }
    }
    async function loadSchedule() {
        try {
            const res = await fetch(`${API_URL}/schedule/${employee.id}`,
            {credentials: "include", });

    
            setSchedule(await res.json());
      
    } catch (error) {
      console.log(error);
    }
  }

    async function loadTimeOff() {
        try {
            const res = await fetch(`${API_URL}/schedule/${employee.id}/timeoff`,
            {credentials: "include", });

    
            setTimeOff(await res.json());
      
    } catch (error) {
      console.log(error);
    }
  }

   async function updateStatus(id, status) {
        try {
            const res = await fetch(`${API_URL}/appointments/${id}/status`, {
                 method: "PUT",
                 headers: { "Content-Type": "application/json" },
                 credentials: "include",
                 body: JSON.stringify({ status }),
                
        });

        const data = await res.json();

        if (res.ok) {
            loadAppointments();


      } else {
        setMessage(data.message || "Status not updated");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  async function addTimeOff() {
        try {
            const res = await fetch(`${API_URL}/schedule/${employee.id}/timeoff`, {
                 method: "POSR",
                 headers: { "Content-Type": "application/json" },
                 credentials: "include",
                 body: JSON.stringify({
                 start_datetime: newTimeOffStart.replace("T", " "),
                 end_datetime: newTimeOffEnd.replace("T", " "),
                 reason: newTimeOffReason,
        }),
                
        });

        const data = await res.json();

        if (res.ok) {
             setNewTimeOffStart("");
             setNewTimeOffEnd("");
             setNewTimeOffReason("");
             loadTimeOff();
             setMessage("Time off added.");


      } else {
        setMessage(data.message || "Timeoff not added");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

   if (!employee) {
    return (
      <main>
        <h1>Employee</h1>
        <p>{message || "Loading..."}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{employee.display_name}</h1>

      <button onClick={() => setStep(1)}>Appointments</button>


      <button onClick={() => setStep(2)}>Schedule</button>

      <button onClick={() => setStep(3)}>Timeoff</button>

      {step == 1 && (
        <section>
             <h2>Appointments</h2>
          {appointments.map((app) => (
            <div key={app.id}>
              <p>{app.start_datetime} — {app.customer_name} — {app.service_name} — {app.status}</p>
                 <button onClick={() => updateStatus(app.id, "confirmed")}>Confirm</button>
                    <button onClick={() => updateStatus(app.id, "cancelled")}>Cancel</button>
                        <button onClick={() => updateStatus(app.id, "completed")}>Complete</button>
                </div>
                       
                       
                       ))}




                 </section>
      )}
      {step == 2 && (
        <section>
                <h2>Schedule</h2>
          {schedule.map((day) => (
            <div key={day.id}>
                   <p>
                        {dayNames[day.day_of_week]} — {day.start_time} to {day.end_time}
                        
                              </p>
                    </div>
            
            
            ))}
        </section>
      )}




      {step == 3 && (
        <section>
          <h2>timeoff</h2>
          {timeOff.map((off) => (
                <div key={off.id}>
                     <p>{off.start_datetime} — {off.end_datetime} — {off.reason}</p>
                
                
                </div>
      
      
      ))}

          <h3>Add timeoff</h3>
                 <div>
                          <label>from</label>
                              <input type="datetime-local" value={newTimeOffStart} onChange={(e) => setNewTimeOffStart(e.target.value)} />
              </div>
          <div>
                <label>to</label>
                    <input type="datetime-local" value={newTimeOffEnd} onChange={(e) => setNewTimeOffEnd(e.target.value)} />
                 </div>

                 
          <div>
             <label>Reason</label>
                  <input type="text" value={newTimeOffReason} onChange={(e) => setNewTimeOffReason(e.target.value)} />
          </div>


           
            
       <button onClick={addTimeOff}>Dodaj</button>
        </section>
      )}

    
    </main>
  );





}

