import { useEffect, useState } from "react";
import { Link } from "react-router";
import { API_URL, barbershop_id } from "../api/api";
//const barbershop_id = 1;

export default function Home() {


  const [barbershop, setBarbershop] = useState(null);

  
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_URL}/barbershops/${barbershop_id}`);

        if (res.ok) {
        setBarbershop(await res.json());
        }

      } catch (error) {
          console.log(error);
      }
    }

    loadData();
  }, []);



let top;

if (barbershop){
  top = (
      <>
                <h1>{barbershop.name}</h1>
                   <p>{barbershop.description}</p>
          <p>{barbershop.address}, {barbershop.city}</p>
      </>

  )
}else {
    top = <h1>NO barbereshop loaded !!</h1>
  }



  return (
    <main className="news-page">
      <section className="news-hero">
        {top}
        <Link to="/book">
        <button className="btn btn-primary ">Rezerviraj termin </button>
        </Link>
      </section>

    </main>
  );
}