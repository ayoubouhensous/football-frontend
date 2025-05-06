import React from 'react';
import Navbar from './navbar/Navbar';
import '../css/Accueil.css'
import  { useEffect } from 'react';

const AcceuilComponent = () => {
  useEffect(() => {
      // Simuler le chargement
      setTimeout(() => {
        document.querySelector('main').style.opacity = 1;
      }, 500);
    }, []);
    return (
      
      <main>
          <div >
        <div className="static">
          <h1 className="js-heading">FOOTBALL LEAGUE</h1>
          <p className="js-subheading">
           Vous etes passionné par le foot , vous etes dans la bonne place rejoignez notre comunauté
          </p>
        </div>
        
        <div className="ball-container">
          <div className="box">
            <div className="shadow"></div>
            <div className="gravity">
              <div className="ball"></div>
            </div>
          </div>
        </div>
        </div>
      </main>
    );
};

export default AcceuilComponent;
