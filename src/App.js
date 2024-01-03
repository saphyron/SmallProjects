import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './Homepage';
import PathfinderPage from './EveSystemFinderFrontEnd';
// Import other components as needed

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/pathfinder">Pathfinder</Link> | <a href="https://github.com/saphyron/SmallProjects/tree/main">Github Page</a>
        {/* Add other links as needed */}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pathfinder" element={<PathfinderPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
