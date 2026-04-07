import React, { useEffect, useCallback } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CreateMatch from './components/CreateMatch';
import MatchList from './components/MatchList';
import Teams from './components/Teams';
import Login from './components/Login';
import { useAuth, useMatches, useTeams, useNavigation } from './hooks/useAppState';
import { generateRoundRobinMatches, generateScheduledMatches } from './utils/matchGenerator';
import matchesData from './data/matches.json';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { matches, setMatches } = useMatches();
  const { setTeams } = useTeams();
  const { currentPage, goToPage } = useNavigation();

  // Generate matches on mount using useCallback
  const generateMatches = useCallback(() => {
    const teamsList = matchesData.teams || [];
    setTeams(teamsList);

    const generatedMatches = generateScheduledMatches(teamsList, {
      startDate: new Date('2026-04-05'),
      numDays: 10,
      weekdayTime: '19:30',
      weekendTimes: ['14:30', '19:30']
    });

    setMatches(generatedMatches);
  }, [setMatches, setTeams]);

  // Initialize on mount
  useEffect(() => {
    generateMatches();
  }, [generateMatches]);

  const handleGenerateMatches = useCallback((teamList) => {
    const generatedMatches = generateRoundRobinMatches(teamList);
    setMatches(generatedMatches.map((match, idx) => ({
      ...match,
      id: Date.now() + idx
    })));
    setTeams(teamList);
    goToPage('matches');
    alert(`Generated ${generatedMatches.length} matches for ${teamList.length} teams!`);
  }, [setMatches, setTeams, goToPage]);

  const handleLogin = useCallback(({ username, password }) => {
    const validUsername = 'admin';
    const validPassword = 'password';

    if (username === validUsername && password === validPassword) {
      login(username);
      goToPage('dashboard');
      return true;
    }

    return false;
  }, [login, goToPage]);

  const handleLogout = useCallback(() => {
    logout();
    goToPage('dashboard');
  }, [logout, goToPage]);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard matches={matches} />;
      case 'teams':
        return <Teams onGenerateMatches={handleGenerateMatches} />;
      case 'create':
        return <CreateMatch />;
      case 'matches':
        return <MatchList matches={matches} />;
      default:
        return <Dashboard matches={matches} />;
    }
  }, [currentPage, matches, handleGenerateMatches]);

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={goToPage} 
        onLogout={handleLogout} 
        isAuthenticated={isAuthenticated} 
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
