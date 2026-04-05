import React, { useState } from 'react';

function Teams({ onGenerateMatches, existingTeams = [] }) {
  const [teams, setTeams] = useState(existingTeams);
  const [teamLogos, setTeamLogos] = useState({});
  const [teamInput, setTeamInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleAddTeam = () => {
    if (teamInput.trim() && !teams.includes(teamInput.trim())) {
      setTeams([...teams, teamInput.trim()]);
      setTeamInput('');
    }
  };

  const handleRemoveTeam = (index) => {
    const teamName = teams[index];
    setTeams(teams.filter((_, i) => i !== index));
    // Remove logo when team is removed
    const newLogos = { ...teamLogos };
    delete newLogos[teamName];
    setTeamLogos(newLogos);
  };

  const handleLogoUpload = (teamName, event) => {
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
  };

  const handleBulkAddTeams = () => {
    const newTeams = bulkInput
      .split('\n')
      .map(t => t.trim())
      .filter(t => t && !teams.includes(t));
    
    const uniqueTeams = [...new Set([...teams, ...newTeams])];
    setTeams(uniqueTeams);
    setBulkInput('');
    setShowBulkInput(false);
  };

  const handleGenerateMatches = () => {
    if (teams.length < 2) {
      alert('Please add at least 2 teams to generate matches');
      return;
    }
    onGenerateMatches(teams);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all teams?')) {
      setTeams([]);
    }
  };

  return (
    <div className="teams-container">
      <h1>Manage Teams 🏟️</h1>
      
      <div className="teams-info">
        <p>Total Teams: <strong>{teams.length}</strong></p>
        <p>Total Matches (Round-Robin): <strong>{teams.length > 0 ? teams.length * (teams.length - 1) : 0}</strong></p>
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
            onClick={() => setShowBulkInput(!showBulkInput)} 
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
            🎯 Generate {teams.length * (teams.length - 1)} Round-Robin Matches
          </button>
        </div>
      )}
    </div>
  );
}

export default Teams;
