import React from 'react';

function Dashboard({ matches }) {
  const upcomingMatches = matches.filter(m => new Date(m.date) > new Date()).length;
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const ongoingMatches = matches.filter(m => m.status === 'ongoing').length;

  return (
    <div className="dashboard">
      <h1>🏏 IPL Tournament Dashboard</h1>
      <div className="dashboard-hero">
        <div className="hero-content">
          <h2>🏟️ Welcome to the IPL Tournament Hub</h2>
          <p>Track live matches, view statistics, and manage your tournament schedule with style!</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-number">{totalMatches}</span>
              <span className="hero-label">Total Matches</span>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{ongoingMatches}</span>
              <span className="hero-label">Live Now</span>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{completedMatches}</span>
              <span className="hero-label">Completed</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="trophy">🏆</div>
          <div className="cricket-ball">🏏</div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">📊</div>
          <div className="stat-number">{totalMatches}</div>
          <div className="stat-label">🏟️ Total Matches</div>
          <div className="stat-description">Scheduled tournament games</div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{upcomingMatches}</div>
          <div className="stat-label">📅 Upcoming Matches</div>
          <div className="stat-description">Matches yet to be played</div>
        </div>
        <div className="stat-card stat-card-orange">
          <div className="stat-icon">🔴</div>
          <div className="stat-number">{ongoingMatches}</div>
          <div className="stat-label">⚡ Live Matches</div>
          <div className="stat-description">Currently in progress</div>
        </div>
        <div className="stat-card stat-card-purple">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{completedMatches}</div>
          <div className="stat-label">🏆 Completed Matches</div>
          <div className="stat-description">Finished games</div>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="recent-matches">
          <h2>📋 Recent Match Activity</h2>
          <div className="matches-timeline">
            {matches.slice(-5).reverse().map(match => (
              <div key={match.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className={`status-dot ${match.status}`}></div>
                </div>
                <div className="timeline-content">
                  <div className="match-teams">
                    <span className="team">{match.team1}</span>
                    <span className="vs">vs</span>
                    <span className="team">{match.team2}</span>
                  </div>
                  <div className="match-meta">
                    <span className="match-date">
                      📅 {new Date(match.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="match-time">🕐 {match.time}</span>
                    <span className={`match-status-badge ${match.status}`}>
                      {match.status === 'ongoing' && '🔴'}
                      {match.status === 'scheduled' && '⏰'}
                      {match.status === 'completed' && '✅'}
                      {match.status === 'cancelled' && '❌'}
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && (
        <div className="empty-state empty-state-colorful">
          <div className="empty-icon">🏏</div>
          <h3>No matches scheduled yet</h3>
          <p>🌟 Create your first match and watch the tournament come alive with dynamic scheduling!</p>
          <div className="empty-decoration">
            <span>⚡</span>
            <span>🏆</span>
            <span>🎯</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
