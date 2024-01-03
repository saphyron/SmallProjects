import logo from './logo.svg';
import './App.css';
import NavigationBar from './NavigationBar';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {


  return (
    
    <div className="App">
      <header className="App-header">
      <NavigationBar></NavigationBar>
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>
    </div>
  );
}

export default App;
