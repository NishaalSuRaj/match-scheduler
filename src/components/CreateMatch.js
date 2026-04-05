import React, { useState } from 'react';

function CreateMatch({ onAddMatch }) {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    date: '',
    time: '',
    location: '',
    status: 'scheduled'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.team1 && formData.team2 && formData.date) {
      onAddMatch(formData);
      setFormData({
        team1: '',
        team2: '',
        date: '',
        time: '',
        location: '',
        status: 'scheduled'
      });
      alert('Match created successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="create-match">
      <h1>Create New Match ⚽</h1>
      <form onSubmit={handleSubmit} className="match-form">
        <div className="form-group">
          <label htmlFor="team1">Team 1 *</label>
          <input
            type="text"
            id="team1"
            name="team1"
            value={formData.team1}
            onChange={handleChange}
            placeholder="Enter team 1 name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="team2">Team 2 *</label>
          <input
            type="text"
            id="team2"
            name="team2"
            value={formData.team2}
            onChange={handleChange}
            placeholder="Enter team 2 name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter match location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">Create Match</button>
      </form>
    </div>
  );
}

export default CreateMatch;
