import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';


function LoginPage({ onLogin, loggingIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Call the function passed down from App.js
      await onLogin(email, password);
      // App.js will handle the redirect on success
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">User Login</h2>
      <p className="auth-subtitle">Welcome back! Please enter your details.</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}
        
        <div className="auth-input-group">
          <span className="auth-icon-emoji">✉️</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="auth-input-group">
          <span className="auth-icon-emoji">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full auth-button"
          disabled={loggingIn}
        >
          {loggingIn ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="auth-switch-link">
          Don't have an account? 
          <Link to="/register">Create one</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;