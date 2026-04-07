import React, { memo, useCallback } from 'react';

const Navigation = memo(({ currentPage, onPageChange, onLogout, isAuthenticated }) => {
  // Memoize page navigation handlers
  const handlePageChange = useCallback((page) => {
    onPageChange(page);
  }, [onPageChange]);

  const handleLogout = useCallback(() => {
    onLogout();
  }, [onLogout]);

  const isActive = useCallback((page) => currentPage === page ? 'active' : '', [currentPage]);

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
                className={`nav-link ${isActive('dashboard')}`}
                onClick={() => handlePageChange('dashboard')}
              >
                🏠 Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${isActive('teams')}`}
                onClick={() => handlePageChange('teams')}
              >
                🧑‍🤝‍🧑 Teams & Generate
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${isActive('create')}`}
                onClick={() => handlePageChange('create')}
              >
                ➕ Create Match
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${isActive('matches')}`}
                onClick={() => handlePageChange('matches')}
              >
                📋 All Matches
              </button>
            </li>
          </ul>
        </div>

        {isAuthenticated && (
          <button className="nav-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        )}
      </div>
    </nav>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.isAuthenticated === nextProps.isAuthenticated
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
