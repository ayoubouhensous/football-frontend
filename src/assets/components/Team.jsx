import React from 'react';
import '../css/Team.css';
import topTeamsData from './dataPlayer/teams.json'; // Importer le fichier JSON
import  { useState, useEffect } from 'react';

const Team = () => {
  const [teamsData , setTeamsData] = useState([]);

  useEffect(() => {
    setTeamsData(topTeamsData); // Charger les données du JSON dans l'état
  }, []);

  return (
    <div className='cont'>
    <div className="team-container">
      {/* Version Desktop - Tableau */}
      <table className="team-table">
        <thead>
          <tr>
            <th className="image">Logo</th>
            <th>Team Name</th>
            <th>Titles Won</th>
            <th>Year Established</th>
            <th>City</th>
            <th>Stadium</th>
          </tr>
        </thead>
        <tbody>
          {teamsData.map((team, index) => (
            <tr key={index}>
              <td className="image">
                <img src={team.logo} alt={team.name} />
              </td>
              <td>{team.name}</td>
              <td>{team.titles}</td>
              <td>{team.established}</td>
              <td>{team.city}</td>
              <td>{team.stadium}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Version Mobile - Liste */}
      <div className="team-list">
        <ul className="list-header">
          <li>Logo</li>
          <li>Team Name</li>
          <li>Titles Won</li>
          <li>Year Established</li>
          <li>City</li>
          <li>Stadium</li>
        </ul>
        
        {teamsData.map((team, index) => (
          <ul key={index} className="list-row">
            <li className="image">
              <img src={team.logo} alt={team.name} />
            </li>
            <li>{team.name}</li>
            <li data-label="Titles Won">{team.titles}</li>
            <li data-label="Year Established">{team.established}</li>
            <li className="city">{team.city}</li>
            <li data-label="Stadium">{team.stadium}</li>
          </ul>
        ))}
      </div>
    </div></div>
  );
};

export default Team;

