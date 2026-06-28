import { useEffect, useState } from "react";
import { Link } from "react-router";

const barbershop_id = 1;

export default function Home() {


  return (
    <main className="news-page">
      <section className="news-hero">
        <h1>Dobrodošli v brivncio</h1>
        <Link to="/book">
        <button Rezerviraj termin></button>
        </Link>
      </section>

    </main>
  );
}