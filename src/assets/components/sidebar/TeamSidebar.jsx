import React, { useState, useEffect } from 'react';
import { getTrendingTeams } from '../../services/FootballService'; // Importer la fonction getTrendingTeams
import '../../css/TeamSidebar.css'; // Assure-toi de créer ce fichier CSS pour styliser le composant

const TeamSidebar = () => {
  const [teams, setTeams] = useState([]); // État pour stocker les équipes

  useEffect(() => {
    const fetchTrendingTeams = async () => {
      try {
        const trendingTeams = await getTrendingTeams();
        setTeams(trendingTeams); // Mettre à jour l'état avec les équipes récupérées
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error);
      }
    };

    fetchTrendingTeams();
  }, []); // Appeler l'API une seule fois lors du premier rendu

  return (
    <div className="team-sidebar">
      <h3>Tendances</h3>
      <ul>
        {teams.length > 0 ? (
          teams.map((team) => (
            <li key={team.id} className="team-item" style={{ borderLeft: `5px solid #0033A0` }}>
              <a href={team.website} target="_blank" rel="noopener noreferrer" className="team-link">
                <span className="team-icon">
                  {team.crestUrl ? (
                    <img src={team.crestUrl} alt={team.name} style={{ width: '20px', height: '20px' }} />
                  ) : (
                    '⚽'
                  )}
                </span> 
                {team.name}
              </a>
            </li>
          ))
        ) : (
          <li>Aucune équipe tendance trouvée</li>
        )}
      </ul>
    </div>
  );
};

export default TeamSidebar;
