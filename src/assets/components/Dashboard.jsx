import React from 'react';
import '../css/Dashboard.css';
import NewsSidebar from './sidebar/NewsSidebar';
import MatchCard from './sidebar/MatchCard';
import TeamSidebar from './sidebar/TeamSidebar';
import MatchList from './sidebar/MatchList';

const Dashboard = () => {
 
  return (
    <div className="dashboard-container">
      <NewsSidebar />
      <div className="main-section">
        <h2 className="section-title">Matchs de football</h2>
        <div className="match-list">
        <MatchList />
        </div>
      </div>
      <TeamSidebar />
    </div>
  );
};

export default Dashboard;