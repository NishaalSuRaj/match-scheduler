import React, { useCallback, useReducer } from 'react';
import { useAuth } from '../hooks/useAppState';

// Login form reducer
const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return { username: '', password: '', error: '' };
    default:
      return state;
  }
};

const initialState = { username: '', password: '', error: '' };

function Login({ onLogin }) {
  const [formState, dispatch] = useReducer(loginReducer, initialState);
  const { login } = useAuth();

  // Memoized field change handlers
  const handleUsernameChange = useCallback((e) => {
    dispatch({ type: 'SET_USERNAME', payload: e.target.value });
  }, []);

  const handlePasswordChange = useCallback((e) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const success = onLogin({ 
      username: formState.username.trim(), 
      password: formState.password 
    });

    if (!success) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials. Use admin / password' });
      return;
    }

    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'RESET' });
    login(formState.username);
  }, [formState, onLogin, login]);

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Welcome Back! 🌟</h1>
        <p className="login-note">Sign in to manage your tournament. Try <strong>admin</strong> / <strong>password</strong></p>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={formState.username}
            onChange={handleUsernameChange}
            placeholder="Enter username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={formState.password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            required
          />

          {formState.error && <div className="login-error">{formState.error}</div>}

          <button type="submit" className="btn-login">Login and Play ⚽</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
