import React, { useEffect, useState } from 'react';
import { getTodayMatches } from '../../services/FootballService';
import MatchCard from './MatchCard';

const MatchList = () => {   
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const todayMatches = await getTodayMatches();
        setMatches(todayMatches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // Grouper les matchs par ligue avec leurs logos
  const groupedMatches = matches.reduce((acc, match) => {
    const leagueName = match.competition.name;
    const leagueLogo = match.competition.emblem || match.competition.logo; // selon ton API
    if (!acc[leagueName]) {
      acc[leagueName] = {
        logo: leagueLogo,
        matches: [],
      };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {});

  return (
    <div className="match-list">
      {Object.entries(groupedMatches).map(([leagueName, data]) => (
        <div key={leagueName} className="league-group">
          <div className="league-header">
            {data.logo && (
              <img src={data.logo} alt={leagueName} className="league-logo" />
            )}
            <h2 className="league-title">{leagueName}</h2>
          </div>

          {data.matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MatchList;
