import React, { useState, useEffect } from 'react';
import '../../css/PlayerCard.css';

const PlayerCard = ({ player }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Définir un intervalle pour retourner la carte toutes les 6 secondes
    const interval = setInterval(() => {
      setIsFlipped((prevIsFlipped) => !prevIsFlipped);
    }, 5000); // 6000 ms = 6 secondes

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`player-card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-top">
            <div className="player-info">
              <div className="player-rating">{player.rating}</div>
              <div className="player-position">{player.position}</div>
              <div className="player-country">
                <img src={player.countryFlag} alt={player.country} />
              </div>
              <div className="player-club">
                <img src={player.clubLogo} alt={player.club} />
              </div>
            </div>
            <div className="player-image">
              <img src={player.image} alt={player.name} />
            </div>
            <div className="player-backname">{player.name.toUpperCase()}</div>
          </div>
          <div className="card-bottom">
            <div className="player-name">{player.name}</div>
            <div className="player-stats">
              <div>
                <ul>
                  <li><span>{player.stats.pace}</span><span>VIT</span></li>
                  <li><span>{player.stats.shooting}</span><span>TIR</span></li>
                  <li><span>{player.stats.passing}</span><span>PAS</span></li>
                </ul>
              </div>
              <div>
                <ul>
                  <li><span>{player.stats.dribbling}</span><span>DRI</span></li>
                  <li><span>{player.stats.defending}</span><span>DEF</span></li>
                  <li><span>{player.stats.physical}</span><span>PHY</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="card-back">
          <div className="back-content">
            <h3>Palmarès</h3>
            <p><strong>Golden Ball:</strong> {player.trophies.ballonDOr}</p>
          <p><strong>World Cup:</strong> {player.trophies.worldCup}</p>
          <p><strong>Trophies:</strong> {player.trophies.clubTitles}</p>
          <p><strong>Goals:</strong> {player.stats.goals}</p>
          <p><strong>Assists:</strong> {player.stats.assists}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
