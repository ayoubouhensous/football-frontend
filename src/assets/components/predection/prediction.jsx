import React, { useState } from 'react';
import '../../css/prediction.css';

const Prediction = () => {
  // États pour chaque statistique
  const [pac, setPac] = useState('');
  const [dri, setDri] = useState('');
  const [sho, setSho] = useState('');
  const [def, setDef] = useState('');
  const [pas, setPas] = useState('');
  const [phy, setPhy] = useState('');

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const averageStats = (
        parseInt(pac || 0) +
        parseInt(dri || 0) +
        parseInt(sho || 0) +
        parseInt(pas || 0) +
        parseInt(def || 0) +
        parseInt(phy || 0)
      ) / 6;
      
      const predictedValue = Math.round(averageStats * 10000 * (averageStats / 10));
      setPrediction(predictedValue);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="stadium-container">
      <div className="pitch">
        <div className="center-circle"></div>
        <div className="prediction-card">
          <h1 className="title">Scout de Joueur Professionnel</h1>
          <p className="subtitle">Analyse de performance et valeur marchande</p>
          
          <form onSubmit={handleSubmit} className="stats-form">
            <div className="stats-grid">
              <div className="stat-item">
                <label>Vitesse (PAC)</label>
                <input 
                  type="number" 
                  value={pac}
                  onChange={(e) => setPac(e.target.value)}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Dribble (DRI)</label>
                <input 
                  type="number" 
                  value={dri}
                  onChange={(e) => setDri(e.target.value)}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Tir (SHO)</label>
                <input 
                  type="number" 
                  value={sho}
                  onChange={(e) => setSho(e.target.value)}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Défense (DEF)</label>
                <input 
                  type="number" 
                  value={def}
                  onChange={(e) => setDef(e.target.value)}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Passe (PAS)</label>
                <input 
                  type="number" 
                  value={pas}
                  onChange={(e) => setPas(e.target.value)}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Physique (PHY)</label>
                <input 
                  type="number" 
                  value={phy}
                  onChange={(e) => setPhy(e.target.value)}
                  min="0" 
                  max="99"
                />
              </div>
            </div>
            
            <button type="submit" className="analyze-btn">
              {isLoading ? 'Analyse en cours...' : 'Analyser le joueur'}
            </button>
          </form>
          
          {prediction && (
            <div className="result-card">
              <div className="player-value">
                <span>Valeur estimée:</span>
                <div className="value">€{prediction.toLocaleString()}</div>
              </div>
              <div className="stats-summary">
                <div className="stat-pair">
                  <span>PAC: {pac}</span>
                  <span>DRI: {dri}</span>
                </div>
                <div className="stat-pair">
                  <span>SHO: {sho}</span>
                  <span>DEF: {def}</span>
                </div>
                <div className="stat-pair">
                  <span>PAS: {pas}</span>
                  <span>PHY: {phy}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;