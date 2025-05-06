import React, { useEffect, useState } from 'react';
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
        // Données simulées d'actualités football
        const mockNews = [
          {
            id: 1,
            title: "Mbappé signe un contrat record avec le Real Madrid",
            url: "https://example.com/news/1",
            source: "L'Équipe",
            date: new Date().toISOString()
          },
          {
            id: 2,
            title: "La France favorite pour l'Euro 2024 selon les bookmakers",
            url: "https://example.com/news/2", 
            source: "RMC Sport",
            date: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 3,
            title: "Le PSG recrute un nouvel entraîneur pour la saison prochaine",
            url: "https://example.com/news/3",
            source: "Le Parisien",
            date: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 4,
            title: "Ligue des Champions : calendrier des quarts de finale dévoilé",
            url: "https://example.com/news/4",
            source: "UEFA",
            date: new Date(Date.now() - 10800000).toISOString()
          }
        ];
        setNews(mockNews);
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

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      )}

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
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`news-item ${readNews.includes(item.id) ? 'read' : ''}`}
            onClick={() => markAsRead(item.id)}
          >
            <div className="news-content">
              <h4 className="news-title">{item.title}</h4>
              <div className="news-meta">
                <span className="news-source">{item.source}</span>
                <span className="news-date">{formatDate(item.date)}</span>
              </div>
            </div>
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

export default NewsSidebar;