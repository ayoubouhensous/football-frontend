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
    console.log(pac, dri, sho, def, pas, phy);
    
    setTimeout(() => {
      fetch("http://127.0.0.1:8000/predicts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          features: [pac, dri, sho, def, pas, phy],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch prediction");
          }
          return response.json();
        })
        .then((data) => {
          setPrediction(data.prediction); // assuming response is { prediction: value }
        })
        .catch((error) => {
          console.error("Error fetching prediction:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1500);    
  }

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
                  onChange={(e) => setPac(parseInt(e.target.value))}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Dribble (DRI)</label>
                <input 
                  type="number" 
                  value={dri}
                  onChange={(e) => setDri(parseInt(e.target.value))}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Tir (SHO)</label>
                <input 
                  type="number" 
                  value={sho}
                  onChange={(e) => setSho(parseInt(e.target.value))}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Défense (DEF)</label>
                <input 
                  type="number" 
                  value={def}
                  onChange={(e) => setDef(parseInt(e.target.value))}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Passe (PAS)</label>
                <input 
                  type="number" 
                  value={pas}
                  onChange={(e) => setPas(parseInt(e.target.value))}
                  min="0" 
                  max="99"
                />
              </div>
              
              <div className="stat-item">
                <label>Physique (PHY)</label>
                <input 
                  type="number" 
                  value={phy}
                  onChange={(e) => setPhy(parseInt(e.target.value))}
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

export default Prediction;