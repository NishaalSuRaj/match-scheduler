import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = onLogin({ username: username.trim(), password });

    if (!success) {
      setError('Invalid credentials. Use admin / password');
      return;
    }

    setError('');
  };

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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-login">Login and Play ⚽</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
