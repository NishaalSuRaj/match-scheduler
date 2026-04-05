import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CreateMatch from './components/CreateMatch';
import MatchList from './components/MatchList';
import Teams from './components/Teams';
import Login from './components/Login';
import { generateRoundRobinMatches, generateScheduledMatches } from './utils/matchGenerator';
import matchesData from './data/matches.json';

function App() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true');

  // Generate matches dynamically instead of loading from JSON
  useEffect(() => {
    const teamsList = matchesData.teams || [];
    setTeams(teamsList);

    // Generate matches with weekday/weekend scheduling
    const generatedMatches = generateScheduledMatches(teamsList, {
      startDate: new Date('2026-04-05'), // Current date
      numDays: 10,
      weekdayTime: '19:30',
      weekendTimes: ['14:30', '19:30']
    });

    setMatches(generatedMatches);
  }, []);

  const handleAddMatch = (match) => {
    setMatches([...matches, { ...match, id: Date.now() }]);
  };

  const handleDeleteMatch = (id) => {
    setMatches(matches.filter(match => match.id !== id));
  };

  const handleEditMatch = (id, updatedMatch) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, ...updatedMatch } : match
    ));
  };

  const handleGenerateMatches = (teamList) => {
    const generatedMatches = generateRoundRobinMatches(teamList);
    setMatches(generatedMatches.map((match, idx) => ({
      ...match,
      id: Date.now() + idx
    })));
    setTeams(teamList);
    setCurrentPage('matches');
    alert(`Generated ${generatedMatches.length} matches for ${teamList.length} teams!`);
  };

  const handleLogin = ({ username, password }) => {
    const validUsername = 'admin';
    const validPassword = 'password';

    if (username === validUsername && password === validPassword) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard matches={matches} />;
      case 'teams':
        return <Teams onGenerateMatches={handleGenerateMatches} existingTeams={teams} />;
      case 'create':
        return <CreateMatch onAddMatch={handleAddMatch} />;
      case 'matches':
        return <MatchList 
          matches={matches} 
          onDelete={handleDeleteMatch}
          onEdit={handleEditMatch}
        />;
      default:
        return <Dashboard matches={matches} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
