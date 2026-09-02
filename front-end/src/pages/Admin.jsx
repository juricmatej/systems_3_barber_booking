import { useEffect, useState } from "react";
import { API_URL, barbershop_id} from "../api/api";
import { useNavigate } from "react-router";
import { getCurrentSession } from "../api/session";





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
  

  const [filterByEmployee, setFilterByEmployee] = useState("");
  
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  


  useEffect(() => {


    /* async function init() {
    const session = await getCurrentSession();
    if (!session.loggedIn || session.user.role !== "admin") {
      navigate("/login");
      return;
    }
  } 
    */
   // init();
    loadAppointments();
    loadServices();
    loadBarbershop();
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

async function loadBarbershop() {
    try {
        const res = await fetch(`${API_URL}/barbershops/${barbershop_id}`);

        const data = await res.json();

        setName(data.name);
        setDescription(data.description);
        setAddress(data.address);
        setCity(data.city);
        setPhone(data.phone);
        setEmail(data.email);


    } catch (error) {
      console.log(error);
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
      setMessage("Employee aded")
    } else {
      setMessage("Employee not added")
    }


    } catch (error) {
      console.log(error);
    }
    
  }


  const employeeOpt = [];
  const employeeSeen = new Set ();

  appointments.forEach((app) =>  {
    if (!employeeSeen.has(app.employee_id)) {
        employeeSeen.add(app.employee_id);
        employeeOpt.push({ id: app.employee_id, name: app.employeeName });
    }
  });


  const filterApp = appointments.filter((app) => {
    if(filterByEmployee && String(app.employee_id) != filterByEmployee) {
      return false;
    }

    return true;
  });


  const now = new Date();



  const upcomng = filterApp.filter((app) => new Date(app.start_datetime) >= now);

  const past = filterApp.filter((app) => new Date (app.start_datetime) < now) ;
  
  const totalApp = filterApp.length;




async function barbershopSave() {

  try {
    
    const res = await fetch (`${API_URL}/barbershops/${barbershop_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        description: description,
        address: address,
        city: city,
        phone: phone,
        email: email,
        }),


        
    })

   
  

  } catch (error) {
    console.log(error);
  }
}



  return (
    <main>
      {message && <p>{message}</p>}
         <h1 className="text-center" >Admin</h1>

     <div className="nav-2">
     <div className="btn-group" role="group" aria-label="Basic example" >
      <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep("1")}>Apointmentts</button>
      <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep("2")}>Services</button>
      <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep("3")}>Add Employee</button>
      <button type="button" className="btn btn-primary btn-lg " onClick={() => setStep("4")}>Barbereshop</button>
        </div>
   
        </div>

      {step == "1" && (
        <section>
          
          <h2>Appointments</h2>
         <div>
            <label>Emplyoee: </label>
                    <select className="form-select" value={filterByEmployee} onChange={(e) => setFilterByEmployee(e.target.value)}>
                     <option value="" >All employees</option>
                       {employeeOpt.map((empl) => (
                     <option key={empl.id} value={empl.id}>{empl.name}</option>
                                        ))}
                </select>
                                        
          </div>
                  <p>All appointments: {totalApp}</p>

                  <h2>Up Coming</h2>
                       
              {upcomng.map((app) => (
      
    
           <div key={app.id}>
              <p>{app.start_datetime} — {app.customer_name} — {app.employeeName} — {app.serviceName} — {app.status}</p>
                
                
                
                <button onClick={() => updateStatus(app.id, "confirmed")}>Confirm</button>
                 <button onClick={() => updateStatus(app.id, "cancelled")}>Cancel</button>
                    <button onClick={() => updateStatus(app.id, "completed")}>Complete</button>
    </div>

    
          ))}

                  <h2>Past</h2>
                    
              {past.map((app) => (
           
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
      {step == "4" && (
        <section>
             <h2>Barbershop</h2>

              <div>
                    <label>Name</label>
                   
                         <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>

                    <label>Description</label>
                         <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>



          <div>
            
            
                <label>Address</label>
                   <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>

              <label>City</label>
                   <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
            <div>
                  <label>Phone</label>
                       <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
              <div>
                 <label>Email</label>
                     <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

                <button onClick={barbershopSave}>Save</button>

        </section>
      )}
    </main>
  );
}