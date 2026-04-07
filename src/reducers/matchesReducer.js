// Initial state
export const initialState = {
  matches: [],
  teams: [],
  currentPage: 'dashboard',
  isAuthenticated: localStorage.getItem('auth') === 'true',
  authUser: localStorage.getItem('username') || null
};

// Reducer function
const matchesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MATCH':
      return {
        ...state,
        matches: [...state.matches, { ...action.payload, id: Date.now() }]
      };

    case 'DELETE_MATCH':
      return {
        ...state,
        matches: state.matches.filter(match => match.id !== action.payload)
      };

    case 'EDIT_MATCH': {
      const { id, updatedMatch } = action.payload;
      return {
        ...state,
        matches: state.matches.map(match =>
          match.id === id ? { ...match, ...updatedMatch } : match
        )
      };
    }

    case 'SET_MATCHES':
      return {
        ...state,
        matches: action.payload.map((match, idx) => ({
          ...match,
          id: match.id || Date.now() + idx
        }))
      };

    case 'CLEAR_MATCHES':
      return {
        ...state,
        matches: []
      };

    case 'SET_TEAMS':
      return {
        ...state,
        teams: action.payload
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };

    case 'SET_AUTH_USER':
      localStorage.setItem('auth', 'true');
      localStorage.setItem('username', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        authUser: action.payload
      };

    case 'CLEAR_AUTH_USER':
      localStorage.removeItem('auth');
      localStorage.removeItem('username');
      return {
        ...state,
        isAuthenticated: false,
        authUser: null
      };

    default:
      return state;
  }
};

export default matchesReducer;
