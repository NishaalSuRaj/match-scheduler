import React, { useState, useMemo, useCallback } from 'react';
import { useMatches } from '../hooks/useAppState';
import MatchCard from './MatchCard';

function MatchList() {
  const { matches, editMatch, deleteMatch } = useMatches();
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Memoize filtered matches to prevent unnecessary recalculations
  const filteredMatches = useMemo(() => {
    if (filter === 'all') return matches;
    return matches.filter(match => match.status === filter);
  }, [matches, filter]);

  // Memoize edit handler
  const handleEditClick = useCallback((match) => {
    setEditingId(match.id);
    setEditData({ ...match });
  }, []);

  // Memoize edit change handler
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Memoize save handler
  const handleSaveEdit = useCallback((id) => {
    editMatch(id, editData);
    setEditingId(null);
    alert('Match updated successfully!');
  }, [editData, editMatch]);

  // Memoize cancel handler
  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  // Memoize filter change handler
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  // Memoize delete handler
  const handleDeleteClick = useCallback((id) => {
    deleteMatch(id);
  }, [deleteMatch]);

  return (
    <div className="match-list">
      <h1>All Matches 🗓️</h1>

      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={handleFilterChange}>
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
            <MatchCard
              key={match.id}
              match={match}
              isEditing={editingId === match.id}
              editData={editData}
              onEditStart={handleEditClick}
              onEditChange={handleEditChange}
              onEditSave={handleSaveEdit}
              onCancel={handleCancel}
              onDelete={handleDeleteClick}
            />
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
