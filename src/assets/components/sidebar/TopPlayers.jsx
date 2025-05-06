import React from 'react';
import PlayerCard from './PlayerCard';
import '../../css/TopPlayers.css';
import topPlayersData from '../dataPlayer/topPlayers.json'; // Importer le fichier JSON
import  { useState, useEffect } from 'react';

const TopPlayers = () => {
  // Liste des 10 meilleurs joueurs
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    setTopPlayers(topPlayersData); // Charger les données du JSON dans l'état
  }, []);
  return (
    <div className="players-page">
    <h1>Top 10 Players of the 2024/2025 Season</h1>
    <div className="players-grid">
        {topPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default TopPlayers;
