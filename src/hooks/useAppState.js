import { useContext, useCallback, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

// Hook for authentication
export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within AppProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    authUser: context.authUser,
    login: useCallback((username) => {
      context.setAuthUser(username);
    }, [context]),
    logout: useCallback(() => {
      context.clearAuthUser();
    }, [context])
  };
};

// Hook for matches management
export const useMatches = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useMatches must be used within AppProvider');
  }

  // Memoized filtered matches by status
  const matchesByStatus = useMemo(() => ({
    all: context.matches,
    scheduled: context.matches.filter(m => m.status === 'scheduled'),
    ongoing: context.matches.filter(m => m.status === 'ongoing'),
    completed: context.matches.filter(m => m.status === 'completed'),
    cancelled: context.matches.filter(m => m.status === 'cancelled')
  }), [context.matches]);

  // Memoized statistics
  const matchStats = useMemo(() => ({
    total: context.matches.length,
    scheduled: context.matches.filter(m => m.status === 'scheduled').length,
    ongoing: context.matches.filter(m => m.status === 'ongoing').length,
    completed: context.matches.filter(m => m.status === 'completed').length,
    cancelled: context.matches.filter(m => m.status === 'cancelled').length
  }), [context.matches]);

  return {
    matches: context.matches,
    matchesByStatus,
    matchStats,
    addMatch: context.addMatch,
    deleteMatch: context.deleteMatch,
    editMatch: context.editMatch,
    setMatches: context.setMatches,
    clearMatches: context.clearMatches
  };
};

// Hook for teams management
export const useTeams = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTeams must be used within AppProvider');
  }

  return {
    teams: context.teams,
    teamCount: context.teams.length,
    setTeams: context.setTeams
  };
};

// Hook for page navigation
export const useNavigation = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useNavigation must be used within AppProvider');
  }

  return {
    currentPage: context.currentPage,
    goToPage: useCallback((page) => {
      context.setCurrentPage(page);
    }, [context])
  };
};

// Hook to filter matches
export const useFilteredMatches = (initialFilter = 'all') => {
  const { matches } = useMatches();

  // Use useMemo to prevent unnecessary recalculations
  return useCallback((filter) => {
    if (filter === 'all') return matches;
    return matches.filter(match => match.status === filter);
  }, [matches]);
};

// Hook for search/filter matches
export const useMatchSearch = () => {
  const { matches } = useMatches();

  return useMemo(() => ({
    searchMatches: (query) => {
      if (!query.trim()) return matches;
      const lowerQuery = query.toLowerCase();
      return matches.filter(match =>
        match.team1?.toLowerCase().includes(lowerQuery) ||
        match.team2?.toLowerCase().includes(lowerQuery) ||
        match.venue?.toLowerCase().includes(lowerQuery)
      );
    },
    searchByTeam: (teamName) => {
      return matches.filter(match =>
        match.team1 === teamName || match.team2 === teamName
      );
    },
    searchByVenue: (venue) => {
      return matches.filter(match => match.venue === venue);
    }
  }), [matches]);
};
