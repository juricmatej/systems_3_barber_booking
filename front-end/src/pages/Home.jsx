import { useEffect, useState } from "react";
import NewsItem from "../components/NewsItem";
import { API_URL } from "../api/api"; 

const barbershop_id = 1;

export default function Home() {
    
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch(`${API_URL}/news`);
        const data = await res.json();

        setNews(data);
      } catch (err) {
        console.log("Error loading news:", err);
      }
    }

    loadNews();
  }, []);

  return (
    <main className="news-page">
      <section className="news-hero">
        <h1>Latest News</h1>
        <p>Read the latest updates and announcements.</p>
      </section>

      <section className="news-grid">
        {news.map((item) => (
          <NewsItem key={item.id} news={item} />
        ))}
      </section>
    </main>
  );
}