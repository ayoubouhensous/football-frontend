// src/components/sidebar/MatchCard.jsx
import React from 'react';
import '../../css/MatchCard.css'; // pour le style

const MatchCard = ({ match }) => {
  const {
    homeTeam,
    awayTeam,
    competition,
    utcDate,
    score,
    status,
    referees,
  } = match;

  return (
    <div className="container">
      <div className="match">
        <div className="match-header">
          
          <div className="match-actions">
            <button className="btn-icon"><span className="material-icons-outlined">grade</span></button>
            <button className="btn-icon"><span className="material-icons-outlined">add_alert</span></button>
          </div>
        </div>

        <div className="match-content">
          <div className="column">
            <div className="team team--home">
              <div className="team-logo">
                <img src={`https://crests.football-data.org/${homeTeam.id}.svg`} alt={homeTeam.name} />
              </div>
              <h2 className="team-name">{homeTeam.name}</h2>
            </div>
          </div>

          <div className="column">
            <div className="match-details">
            <div className="match-date">
            <span className="date">
              {new Date(utcDate).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long"
              })} at 
            </span>{" "}
            <strong className="time">
              {new Date(utcDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </strong>
          </div>

          <div className="match-score">
        {new Date(utcDate) > new Date() && match.prediction ? (
    // Si le match est dans le futur et qu'une prédiction est disponible
    <span>{match.prediction.predicted_home_goals} - {match.prediction.predicted_away_goals}</span>
  ) : (
    // Sinon, on affiche le score réel
    <span>{score.fullTime.home ?? '-'} - {score.fullTime.away ?? '-'}</span>
  )}
</div>


              {status === 'LIVE' && <div className="match-time-lapsed">Live</div>}
              <div className="match-referee">
              <p>
                Referee: <strong>{referees && referees.length > 0 && referees[0]?.name ? referees[0].name : "Inconnu"}</strong>
              </p>
            </div>

            </div>
          </div>

          <div className="column">
            <div className="team team--away">
              <div className="team-logo">
                <img src={`https://crests.football-data.org/${awayTeam.id}.svg`} alt={awayTeam.name} />
              </div>
              <h2 className="team-name">{awayTeam.name}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
