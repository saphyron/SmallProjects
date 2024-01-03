import React, { useState } from 'react';
import './App.css';
import { dijkstra } from './Pathfinder';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
const evesystems = require('./EveSystemsTheForge.json')

// Example system data
const systems = evesystems;

function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [speed, setSpeed] = useState('');
  const [ignoreLowSecurity, setIgnoreLowSecurity] = useState(false);
  const [result, setResult] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [ignored, setIgnored] = useState('');

  const handleInputChange = (value, isStartLocation) => {
    if (isStartLocation) {
      setStart(value);
      updateSuggestions(value, setStartSuggestions);
    } else {
      setEnd(value);
      updateSuggestions(value, setEndSuggestions);
    }
  };

  const updateSuggestions = (value, setSuggestions) => {
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      const systemNames = Object.keys(systems).sort();
      const filteredSuggestions = systemNames.filter(system => regex.test(system));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (name, isStartLocation) => {
    if (isStartLocation) {
      setStart(name);
      setStartSuggestions([]);
    } else {
      setEnd(name);
      setEndSuggestions([]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ignoredSystems = ignored.split(',').map(system => system.trim());
    const pathResult = dijkstra(systems, start, end, parseFloat(speed), ignoreLowSecurity, ignoredSystems);

    setResult(`Path: ${pathResult.path.join(' -> ')}, Total Time: ${pathResult.totalTime} seconds`);
  };

  

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={start}
            onChange={(e) => handleInputChange(e.target.value, true)}
            placeholder="Start Location"
            required
          />
          {startSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {startSuggestions.map((name, index) => (
                <li key={index} onClick={() => selectSuggestion(name, true)}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={end}
            onChange={(e) => handleInputChange(e.target.value, false)}
            placeholder="End Location"
            required
          />
          {endSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {endSuggestions.map((name, index) => (
                <li key={index} onClick={() => selectSuggestion(name, false)}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder="Speed"
          required
        />
        <select
          value={ignoreLowSecurity}
          onChange={(e) => setIgnoreLowSecurity(e.target.value === 'true')}
        >
          <option value={false}>Allow Low Security</option>
          <option value={true}>Ignore Low Security</option>
        </select>
        <button type="submit">Find Path</button>
        <input
  type="text"
  value={ignored}
  onChange={(e) => setIgnored(e.target.value)}
  placeholder="Ignored Systems (comma-separated)"
/>
      </form>
      {result && <div className="result">{result}</div>}
    </div>
  );
}

export default App;