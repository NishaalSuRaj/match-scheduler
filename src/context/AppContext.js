import React, { createContext, useReducer, useCallback, useMemo } from 'react';
import matchesReducer, { initialState } from '../reducers/matchesReducer';

// Create the context
export const AppContext = createContext();

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(matchesReducer, initialState);

  // Memoized action creators
  const addMatch = useCallback((match) => {
    dispatch({
      type: 'ADD_MATCH',
      payload: match
    });
  }, []);

  const deleteMatch = useCallback((id) => {
    dispatch({
      type: 'DELETE_MATCH',
      payload: id
    });
  }, []);

  const editMatch = useCallback((id, updatedMatch) => {
    dispatch({
      type: 'EDIT_MATCH',
      payload: { id, updatedMatch }
    });
  }, []);

  const setMatches = useCallback((matches) => {
    dispatch({
      type: 'SET_MATCHES',
      payload: matches
    });
  }, []);

  const setTeams = useCallback((teams) => {
    dispatch({
      type: 'SET_TEAMS',
      payload: teams
    });
  }, []);

  const setAuthUser = useCallback((username) => {
    dispatch({
      type: 'SET_AUTH_USER',
      payload: username
    });
  }, []);

  const clearAuthUser = useCallback(() => {
    dispatch({
      type: 'CLEAR_AUTH_USER'
    });
  }, []);

  const setCurrentPage = useCallback((page) => {
    dispatch({
      type: 'SET_CURRENT_PAGE',
      payload: page
    });
  }, []);

  const clearMatches = useCallback(() => {
    dispatch({
      type: 'CLEAR_MATCHES'
    });
  }, []);

  // Memoized value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // State
    matches: state.matches,
    teams: state.teams,
    currentPage: state.currentPage,
    isAuthenticated: state.isAuthenticated,
    authUser: state.authUser,
    
    // Actions
    addMatch,
    deleteMatch,
    editMatch,
    setMatches,
    setTeams,
    setAuthUser,
    clearAuthUser,
    setCurrentPage,
    clearMatches
  }), [
    state.matches,
    state.teams,
    state.currentPage,
    state.isAuthenticated,
    state.authUser,
    addMatch,
    deleteMatch,
    editMatch,
    setMatches,
    setTeams,
    setAuthUser,
    clearAuthUser,
    setCurrentPage,
    clearMatches
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
