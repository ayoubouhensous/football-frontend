import React, { useEffect, useState } from 'react';
import { getFootballNews } from '../../services/FootballService'; // Assurez-vous que le chemin d'importation est correct
import '../../css/NewsSidebar.css';

const NewsSidebar = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readNews, setReadNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await getFootballNews();
        setNews(newsData);
      } catch (err) {
        setError('Erreur lors du chargement des actualités');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulation de rafraîchissement
      await new Promise(resolve => setTimeout(resolve, 800));
      const refreshedNews = [...news].sort(() => 0.5 - Math.random());
      setNews(refreshedNews);
      setReadNews([]);
    } catch (err) {
      setError('Erreur lors du rafraîchissement');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    if (!readNews.includes(id)) {
      setReadNews([...readNews, id]);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="news-sidebar">
      <div className="sidebar-header">
        <h3>
          <span className="news-icon">⚽</span>
          Dernières Actualités
        </h3>
        <button 
          className="refresh-btn" 
          onClick={handleRefresh}
          aria-label="Rafraîchir les actualités"
        >
          <span className="refresh-icon">🔄</span>
        </button>
      </div>


      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={handleRefresh}>Réessayer</button>
        </div>
      )}

      <div className="news-list">
        {!loading && !error && news.length === 0 && (
          <div className="empty-state">
            <p>Aucune actualité disponible</p>
          </div>
        )}

        {news.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`news-item ${readNews.includes(item.url) ? 'read' : ''}`}
            onClick={() => markAsRead(item.url)}
          >
            <div className="news-content">
              <h4 className="news-title">{item.title}</h4>
              <div className="news-meta">
                <span className="news-source">{item.source.name}</span>
                <span className="news-author">{item.author}</span>
                <span className="news-date">{formatDate(item.publishedAt)}</span>
              </div>
              {item.urlToImage && (
                <img src={item.urlToImage} alt={item.title} className="news-image" />
              )}
            <p className="news-description">
              {item.description && item.description.length > 100
                ? item.description.substring(0, 100) + '...'
                : item.description}
            </p>            </div>
          </a>
        ))}
      </div>

      <div className="sidebar-footer">
        <a 
          href="https://example.com/all-news" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="view-all"
        >
          Voir plus d'actualités → 
        </a>
      </div>
    </div>
  );
};

export default NewsSidebar;
