import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';


function ProviderLoginPage({ onLogin, loggingIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Call the function passed down from App.js
      await onLogin(email, password);
      // App.js will handle the redirect
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Provider Login</h2>
      <p className="auth-subtitle">Access your provider dashboard.</p>
      
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
          {loggingIn ? 'Logging In...' : 'Login'}
        </button>
        
        <div className="auth-switch-link">
          Need an account? 
          <Link to="/provider-register">Join as Provider</Link>
        </div>
      </form>
    </div>
  );
}

export default ProviderLoginPage;