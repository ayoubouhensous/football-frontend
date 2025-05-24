import React, { useEffect, useState } from 'react';
import { getTodayMatches } from '../../services/FootballService';
import MatchCard from './MatchCard';
import axios from 'axios';

const MatchList = () => {   
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const todayMatches = await getTodayMatches();

        // Appel API FastAPI pour chaque match
        const matchesWithPredictions = await Promise.all(
          todayMatches.map(async (match) => {
            try {
              const response = await axios.post('http://127.0.0.1:8888/predict/', {
                home_team: match.homeTeam.name,
                away_team: match.awayTeam.name,
                match_date: new Date(match.utcDate).toISOString().split('T')[0]
              });
              console.log('Réponse de l\'API pour', match.homeTeam.name, 'vs', match.awayTeam.name, ':', response.data);

              return {
                ...match,
                prediction: response.data
              };
            } catch (err) {
              
              console.error("Erreur de prédiction pour", match.homeTeam.name, "vs", match.awayTeam.name);
              return {
                ...match,
                prediction: null
              };
            }
          })
        );
        

        setMatches(matchesWithPredictions);
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

  const groupedMatches = matches.reduce((acc, match) => {
    const leagueName = match.competition.name;
    const leagueLogo = match.competition.emblem || match.competition.logo;
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
