import { API_URL } from "../api/api";
import { useState, useEffect } from "react";


const dayNames = ["", "Monday", "Tuesday", "Wednsday", "Thursday", "Firday", "Sunday", "Saturday"];

export default function Barber() {
    
    

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




    const [editDay, setEditDay] = useState(1);
    const [editStartTime, setEditStartTime] = useState("09:00");
    const [editEndTime, setEditEndTime] = useState("17:00");
    const [editBreakStart, setEditBreakStart] = useState("");
    const [editBreakEnd, setEditBreakEnd] = useState("");
    const [editIsActive, setEditIsActive] = useState(true);

    
    
    const [message, setMessage] = useState("");
    
    
    const [step, setStep] = useState(1);

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

        loadData();
    }, []);

    useEffect(() => {
        if(!employee){
            return;

        };
        
        loadAppointments();
        loadSchedule();
        loadTimeOff();

    }, [employee]);



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
                 method: "POST",
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


  async function putScheduleDay() {
    setMessage("");
    
    try {
       let isActiveValue;

            if (editIsActive) {
                isActiveValue = 1;
            } else {
                isActiveValue = 0;
            }

              const res = await fetch(`${API_URL}/schedule/${employee.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    day_of_week: editDay,
                    start_time: editStartTime,
                    end_time: editEndTime,
                    start_break: editBreakStart,
                    end_break: editBreakEnd,
                    is_active: isActiveValue,
                }),
            });

            
      const data = await res.json();

      if(res.ok) {
        setMessage("Sucsefulle operation")
      } else {
        setMessage(data.message)
      }


    }catch (err) {
      console.log(err);

    


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
      <div className="nav-2">
  

        <div className="btn-group" role="group" aria-label="Basic example" >
      <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>Appointments</button>


      <button  type="button" className="btn btn-primary" onClick={() => setStep(2)}>Schedule</button>

      <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Timeoff</button>
          </div>
          <h2>{employee.display_name}</h2>

          

    </div>


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
            <h3>Set your schedule:</h3>
            <div className="boxed-2">
            <div>
                <label>Select day</label>
    
                <select className="form-select" value={editDay} onChange={(e) => setEditDay(Number(e.target.value))}>
                    {dayNames.map((name, index) => {
                        if (index == 0) {
                            return null;
                        }

                        return <option key={index} value={index}>{name}</option>;
                    })}
                </select>
            </div>
             <div>
                <label>Active?</label>
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
            </div>
            </div>
            <div>
                <label>Start time</label>
                <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} />
            </div>
            <div>
                <label>End time</label>
                <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
            </div>
            <div>
                <label>Break start (optional)</label>
                <input type="time" value={editBreakStart} onChange={(e) => setEditBreakStart(e.target.value)} />
            </div>
            <div>
                <label>Break end (optional)</label>
                <input type="time" value={editBreakEnd} onChange={(e) => setEditBreakEnd(e.target.value)} />
            </div>

            <button className="btn btn-primary" onClick={putScheduleDay}>Save</button>
         
          {message && <p className="alert alert-primary">{message}</p>}
            
        </section>
      )}




      {step == 3 && (
        <section>
          <h2>Timeoff</h2>
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


           
            
       <button className="btn btn-primary" onClick={addTimeOff}>Dodaj</button>
        </section>
      )}

    
    </main>
  );





}

