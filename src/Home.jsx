import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

function Home() {
  const [latestArticles, setLatestArticles] = useState([]);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch('http://localhost:3001/api/articles');
        const data = await res.json();
        const items = Array.isArray(data) ? data : [];
        const sorted = items
          .slice()
          .sort((a, b) => {
            const at = new Date(a?.article?.changedTime || a?.article?.addedTime || 0).getTime();
            const bt = new Date(b?.article?.changedTime || b?.article?.addedTime || 0).getTime();
            return bt - at;
          })
          .slice(0, 10);
        setLatestArticles(sorted);
      } catch (e) {
        console.error('Failed to load latest articles', e);
      }
    }
    loadLatest();
  }, []);

  return (
    <div className="home-container">
      <nav className="navigation">
        <ul className="nav-links">
          <li>
            <a href="/news" className="nav-link">News</a>
          </li>
          <li>
            <a href="/analytics" className="nav-link">Analytics Insights</a>
          </li>
          <li>
            <Link to="/about" className="nav-link">About us</Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">Contact us</Link>
          </li>
        </ul>
      </nav>
      <section className="latest-news">
        <h1>Latest News</h1>
        <div className="news-grid">
          {latestArticles.map((item) => (
            <a key={item?._id} href={`/articles/${item?._id}`} className="news-link">
              {item?.article?.imageUrl ? (
                <img src={item.article.imageUrl} alt={item?.article?.title || ''} className="news-image" />
              ) : null}
              <h2 className="news-title">{item?.article?.title}</h2>
              <p className="news-description">{item?.article?.description}</p>
            </a>
          ))}
        </div>
        </section>
    </div>
  );
}

export default Home;