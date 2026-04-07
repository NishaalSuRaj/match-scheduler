import React, { useState, useCallback, useMemo } from 'react';
import { useTeams } from '../hooks/useAppState';

function Teams({ onGenerateMatches }) {
  const { teams: contextTeams, setTeams: setContextTeams } = useTeams();
  const [teams, setTeams] = useState(contextTeams);
  const [teamLogos, setTeamLogos] = useState({});
  const [teamInput, setTeamInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Memoized add team handler
  const handleAddTeam = useCallback(() => {
    if (teamInput.trim() && !teams.includes(teamInput.trim())) {
      const newTeams = [...teams, teamInput.trim()];
      setTeams(newTeams);
      setContextTeams(newTeams);
      setTeamInput('');
    }
  }, [teamInput, teams, setContextTeams]);

  // Memoized remove team handler
  const handleRemoveTeam = useCallback((index) => {
    const teamName = teams[index];
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    setContextTeams(newTeams);
    
    const newLogos = { ...teamLogos };
    delete newLogos[teamName];
    setTeamLogos(newLogos);
  }, [teams, teamLogos, setContextTeams]);

  // Memoized logo upload handler
  const handleLogoUpload = useCallback((teamName, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTeamLogos(prev => ({
          ...prev,
          [teamName]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Memoized bulk add handler
  const handleBulkAddTeams = useCallback(() => {
    const newTeams = bulkInput
      .split('\n')
      .map(t => t.trim())
      .filter(t => t && !teams.includes(t));
    
    const uniqueTeams = [...new Set([...teams, ...newTeams])];
    setTeams(uniqueTeams);
    setContextTeams(uniqueTeams);
    setBulkInput('');
    setShowBulkInput(false);
  }, [bulkInput, teams, setContextTeams]);

  // Memoized generate matches handler
  const handleGenerateMatches = useCallback(() => {
    if (teams.length < 2) {
      alert('Please add at least 2 teams to generate matches');
      return;
    }
    onGenerateMatches(teams);
  }, [teams, onGenerateMatches]);

  // Memoized clear all handler
  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all teams?')) {
      setTeams([]);
      setContextTeams([]);
    }
  }, [setContextTeams]);

  // Memoized toggle bulk input handler
  const handleToggleBulkInput = useCallback(() => {
    setShowBulkInput(!showBulkInput);
  }, [showBulkInput]);

  // Memoized calculated stats
  const stats = useMemo(() => ({
    totalTeams: teams.length,
    totalMatches: teams.length > 0 ? teams.length * (teams.length - 1) : 0
  }), [teams.length]);

  return (
    <div className="teams-container">
      <h1>Manage Teams 🏟️</h1>
      
      <div className="teams-info">
        <p>Total Teams: <strong>{stats.totalTeams}</strong></p>
        <p>Total Matches (Round-Robin): <strong>{stats.totalMatches}</strong></p>
        <p className="info-text">Each team plays every other team at their home ground. Ready for the league fiesta!</p>
      </div>

      <div className="teams-input-section">
        <div className="single-team-input">
          <h3>Add Single Team</h3>
          <div className="input-group">
            <input
              type="text"
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddTeam();
              }}
              placeholder="Enter team name"
            />
            <button onClick={handleAddTeam} className="btn-add">Add Team</button>
          </div>
        </div>

        <div className="bulk-input-section">
          <button 
            onClick={handleToggleBulkInput}
            className="btn-toggle-bulk"
          >
            {showBulkInput ? 'Hide' : 'Show'} Bulk Add
          </button>
          
          {showBulkInput && (
            <div className="bulk-input">
              <h3>Add Multiple Teams</h3>
              <p>Enter one team name per line</p>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Team 1&#10;Team 2&#10;Team 3&#10;..."
                rows={10}
              />
              <button onClick={handleBulkAddTeams} className="btn-add-bulk">Add All Teams</button>
            </div>
          )}
        </div>
      </div>

      <div className="teams-list-section">
        <div className="list-header">
          <h2>Teams List ({teams.length})</h2>
          <button onClick={handleClearAll} className="btn-clear-all">Clear All</button>
        </div>

        {teams.length > 0 ? (
          <div className="teams-grid">
            {teams.map((team, index) => (
              <div key={index} className="team-card">
                <div className="team-logo-container">
                  {teamLogos[team] ? (
                    <img src={teamLogos[team]} alt={`${team} logo`} className="team-logo-image" />
                  ) : (
                    <div className="team-logo-placeholder">
                      {team.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <label className="logo-upload-label" title="Upload team logo">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(team, e)}
                      style={{ display: 'none' }}
                    />
                    📷
                  </label>
                </div>
                <div>
                  <div className="team-number">#{index + 1}</div>
                  <div className="team-name">{team}</div>
                </div>
                <button
                  onClick={() => handleRemoveTeam(index)}
                  className="btn-remove-team"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No teams added yet. Add teams to get started!</p>
          </div>
        )}
      </div>

      {teams.length >= 2 && (
        <div className="generate-section">
          <button 
            onClick={handleGenerateMatches} 
            className="btn-generate-matches"
          >
            🎯 Generate {stats.totalMatches} Round-Robin Matches
          </button>
        </div>
      )}
    </div>
  );
}

export default Teams;
