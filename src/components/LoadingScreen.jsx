// LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ progress = 0 }) => {
  return (
    <div className="loadingScreen">
      <div className="loadingContent">
        <img 
          src="/molbio-black-logo.png" 
          alt="Molbio" 
          className="loadingLogo"
          loading="eager"
        />
        <h1 className="loadingTitle">REGULATORY AFFAIRS</h1>
        <div className="loadingBar">
          <div 
            className="loadingProgress" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="loadingText">Loading presentation... {progress}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
