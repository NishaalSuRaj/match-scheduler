import React, { useState } from 'react';

function MatchList({ matches, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const handleEditClick = (match) => {
    setEditingId(match.id);
    setEditData({ ...match });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = (id) => {
    onEdit(id, editData);
    setEditingId(null);
    alert('Match updated successfully!');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      onDelete(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#e3f2fd';
      case 'ongoing': return '#fff3e0';
      case 'completed': return '#e8f5e9';
      case 'cancelled': return '#ffebee';
      default: return '#f5f5f5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'scheduled': return '#1976d2';
      case 'ongoing': return '#f57c00';
      case 'completed': return '#388e3c';
      case 'cancelled': return '#c62828';
      default: return '#666';
    }
  };

  return (
    <div className="match-list">
      <h1>All Matches 🗓️</h1>

      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Matches</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredMatches.length > 0 ? (
        <div className="matches-grid">
          {filteredMatches.map(match => (
            editingId === match.id ? (
              <div key={match.id} className="match-card editing-card">
                <div className="card-header">
                  <h3>Edit Match</h3>
                </div>
                <div className="card-content">
                  <div className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Team 1</label>
                        <input
                          type="text"
                          name="team1"
                          value={editData.team1}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Team 2</label>
                        <input
                          type="text"
                          name="team2"
                          value={editData.team2}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          name="date"
                          value={editData.date}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Time</label>
                        <input
                          type="time"
                          name="time"
                          value={editData.time}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleEditChange}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-save" onClick={() => handleSaveEdit(match.id)}>💾 Save</button>
                  <button className="btn-cancel" onClick={() => setEditingId(null)}>❌ Cancel</button>
                </div>
              </div>
            ) : (
              <div key={match.id} className="match-card">
                <div className="card-header">
                  <div className="teams-vs">
                    <div className="team-container">
                      <div className="team-logo">{match.team1.charAt(0)}</div>
                      <div className="team-name">{match.team1}</div>
                    </div>
                    <div className="vs-text">VS</div>
                    <div className="team-container">
                      <div className="team-logo">{match.team2.charAt(0)}</div>
                      <div className="team-name">{match.team2}</div>
                    </div>
                  </div>
                  <div className={`status-badge ${match.status}`}>
                    {match.status === 'ongoing' && '🔴'}
                    {match.status === 'scheduled' && '⏰'}
                    {match.status === 'completed' && '✅'}
                    {match.status === 'cancelled' && '❌'}
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                  </div>
                </div>

                <div className="card-content">
                  <div className="match-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        {new Date(match.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span className="detail-text">{match.time || 'TBD'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{match.location || 'TBD'}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEditClick(match)}>✏️ Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteClick(match.id)}>🗑️ Delete</button>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="empty-state empty-state-colorful">
          <p>🎈 No matches found for that filter. Try switching the status or creating a new match.</p>
        </div>
      )}
    </div>
  );
}

export default MatchList;
