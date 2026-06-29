import { useEffect, useState } from "react";
import { API_URL } from "../api/api";
import { useNavigate } from "react-router";
import { getCurrentSession } from "../api/session";




const barbershop_id = 1;

export default function Admin() {

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newEmpUserId, setNewEmpUserId] = useState("");
  const [newEmpDisplayName, setNewEmpDisplayName] = useState("");
  const [newEmpBio, setNewEmpBio] = useState("");
  
  
  const [step, setStep] = useState(1);
  
  
  const navigate = useNavigate();


  useEffect(() => {


     async function init() {
    const session = await getCurrentSession();
    if (!session.loggedIn || session.user.role !== "admin") {
      navigate("/login");
      return;
    }
  } 
    init();
    loadAppointments();
    loadServices();
  }, []);

  async function loadAppointments() {
    const res = await fetch(`${API_URL}/appointments?barbershop_id=${barbershop_id}`,
      { credentials: "include" }
    );
    if (res.ok) {
        setAppointments(await res.json());
    }
  }

  async function loadServices() {
try {
     const res = await fetch(`${API_URL}/services?barbershop_id=${barbershop_id}`);
    if (res.ok) { 
        setServices(await res.json());
    }
} catch (error) {
    console.log(error)    
}

}

  async function updateStatus(id, status) {
    try {
        const res = await fetch(`${API_URL}/appointments/${id}/status`, 
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      loadAppointments();
    } 
    } catch (error) {
        console.log(error)
    }
    
  }

  async function addService() {
   try {
    const res = await fetch(`${API_URL}/services`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        barbershop_id,
        name: newServiceName,
        description: newServiceDesc,
        duration_min: Number(newServiceDuration),
        price: Number(newServicePrice),
      }),
    });
    if (res.ok) {
      setNewServiceName("");
      setNewServiceDesc("");
      setNewServiceDuration("");
      setNewServicePrice("");
      loadServices();
    }
   } catch (error) {
        console.log(error);
   }
    
  }

  async function addEmployee() {
    try {
        const res = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user_id: Number(newEmpUserId),
        barbershop_id,
        display_name: newEmpDisplayName,
        bio: newEmpBio,
      }),
    });
    if (res.ok) {
      setNewEmpUserId("");
      setNewEmpDisplayName("");
      setNewEmpBio("");
    } 
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <main>
      <h1>Admin</h1>

      <button onClick={() => setStep("1")}>Apointmentts</button>
      <button onClick={() => setStep("2")}>Services</button>
      <button onClick={() => setStep("3")}>ADD Employee</button>

      {step == "1" && (
        <section>
          
          <h2>Appointments</h2>
              {appointments.map((app) => (
           
           <div key={app.id}>
              <p>{app.start_datetime} — {app.customer_name} — {app.employeeName} — {app.serviceName} — {app.status}</p>
                <button onClick={() => updateStatus(app.id, "confirmed")}>Confirm</button>
                 <button onClick={() => updateStatus(app.id, "cancelled")}>Cancel</button>
                    <button onClick={() => updateStatus(app.id, "completed")}>Complete</button>
    </div>
          ))}
        </section>
      )}

      {step  == "2" && (
        <section>
            <h2>Services</h2>
                {services.map((ser) => (
                    <div key={ser.id}>
                        <p>{ser.name} — {ser.duration_min} min — {ser.price} €</p>
                    </div>
          ))}

         <h3>Add Service</h3>
          <div>
                <label>Name</label>

                    <input type="text" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} />
          </div>
           <div>
            <label>Description</label>
                <input type="text" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} />
          
          
          </div>
          <div>
                <label>Duration (min)</label>
                    
                 <input type="number" value={newServiceDuration} onChange={(e) => setNewServiceDuration(e.target.value)} />
          
          
          </div>
          <div>

            <label>Price (€)</label>
            
                 <input type="number" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} />
          </div>
        
         <button onClick={addService}>Add Service</button>
        </section>



      )}

      {step == "3" && (
        <section>
             <h2>Adde Employee</h2>
          <div>
             <label>User ID</label>
                  <input type="number" value={newEmpUserId} onChange={(e) => setNewEmpUserId(e.target.value)} />
          </div>
          <div>

            <label>Display Name</label>

                <input type="text" value={newEmpDisplayName} onChange={(e) => setNewEmpDisplayName(e.target.value)} />
          </div>
           <div>
              <label>Bio</label>
                <input type="text" value={newEmpBio} onChange={(e) => setNewEmpBio(e.target.value)} />
          </div>
          
          
          <button onClick={addEmployee}>Employee +</button>
        </section>
      )}
    </main>
  );
}