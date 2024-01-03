import React from 'react';
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <div className="navigation-container">
      <h1>Melvor Idle Planner</h1>
      <div className="tabs">
        <button className="tab">Money Making</button>
        <button className="tab active">Skill Planner</button>
        <button className="tab">Skill Training</button>
      </div>
      {/* Main navigation content would go here */}
    </div>
  );
};

export default NavigationBar;
