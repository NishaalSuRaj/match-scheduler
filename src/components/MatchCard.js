import React, { memo, useCallback } from 'react';

// MatchCard component with React.memo for performance optimization
const MatchCard = memo(({ match, isEditing, editData, onEditStart, onEditChange, onEditSave, onDelete }) => {
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const handleDeleteClick = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      onDelete(match.id);
    }
  }, [match.id, onDelete]);

  if (isEditing) {
    return (
      <div className="match-card editing-card">
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
                  onChange={onEditChange}
                />
              </div>
              <div className="form-group">
                <label>Team 2</label>
                <input
                  type="text"
                  name="team2"
                  value={editData.team2}
                  onChange={onEditChange}
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
                  onChange={onEditChange}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={editData.time}
                  onChange={onEditChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={onEditChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={onEditChange}
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
          <button className="btn-save" onClick={() => onEditSave(match.id)}>💾 Save</button>
          <button className="btn-cancel" onClick={onEditStart}>❌ Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="match-card">
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
              {formatDate(match.date)}
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
        <button className="btn-edit" onClick={() => onEditStart(match)}>✏️ Edit</button>
        <button className="btn-delete" onClick={handleDeleteClick}>🗑️ Delete</button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.match === nextProps.match &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.editData === nextProps.editData
  );
});

MatchCard.displayName = 'MatchCard';

export default MatchCard;
