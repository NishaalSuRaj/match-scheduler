import React from 'react';

function Navigation({ currentPage, onPageChange, onLogout, isAuthenticated }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo">
            ⚽ Match Scheduler
          </div>
          <ul className="nav-menu">
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => onPageChange('dashboard')}
              >
                🏠 Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'teams' ? 'active' : ''}`}
                onClick={() => onPageChange('teams')}
              >
                🧑‍🤝‍🧑 Teams & Generate
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'create' ? 'active' : ''}`}
                onClick={() => onPageChange('create')}
              >
                ➕ Create Match
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'matches' ? 'active' : ''}`}
                onClick={() => onPageChange('matches')}
              >
                📋 All Matches
              </button>
            </li>
          </ul>
        </div>

        {isAuthenticated && (
          <button className="nav-logout" onClick={onLogout}>
            🚪 Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
