import React, { useEffect, useState } from 'react';
import './styles/home.css';
import './styles/divider.css';
import './styles/card.css'

/**
 * Component for fetching and rendering latest news cards
 * Fetches from /api/articles/latest/cards, and renders in the correct card layout.
 * The left side has grouped news articles, the right is the image (see card-type-1 in card.css)
 */
function LatestNewsCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles/latest/cards?limit=8')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!cards.length) return <div>No news available.</div>;

  return (
    <div>
      {cards.map((card, idx) => (
        <div key={idx} className="card-type-1">
          {/* LEFT: news items */}
          <div className="card-type-1-news">
            {(card.articles || []).map((item, i) => (
              <a
                key={item?._id || i}
                href={`/articles/${item?._id}`}
                className="card-type-1-news-item"
              >
                <h3 className="card-type-1-news-title">
                  {item?.article?.title}
                </h3>
                <div className="card-type-1-news-description">
                  {item?.article?.description}
                </div>
              </a>
            ))}
          </div>
          {/* RIGHT: image for this card group */}
          <div className="card-type-1-picture">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt=""
                className="card-type-1-image"
              />
            ) : (
              <div style={{ minHeight: 180, minWidth: 320, background: 'rgba(100,108,255,0.07)', borderRadius: 8 }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Component for fetching and rendering 5 latest articles in small-card list
 * Fetches from /api/articles/latest?limit=5
 */
function LatestSmallCards() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles/latest?limit=5')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching latest 5 articles:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!articles.length) return <div>No recent articles.</div>;

  return (
    <ul className="small-cards">
      {articles.map((item) => (
        <li key={item?._id} className="small-card">
          <a href={`/articles/${item?._id}`}>
            <div className="small-card-thumb" />
            <div>
              <h4 className="small-card-title">{item?.article?.title}</h4>
              <div className="small-card-description">{item?.article?.description}</div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Home() {
  return (
    <div className="home-container">
      <div className="home-split">

      <div className="home-container-right">
          <section className="latest-news">
            <div>
              <LatestNewsCards />
            </div>
          </section>
        </div>
        
        <div className="divider divider--vertical" />

        <div className="home-container-left">
          <LatestSmallCards />
        </div>


        
      </div>
    </div>
  );
}

export default Home;