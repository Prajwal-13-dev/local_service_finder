import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import api from '../api';

function ProviderRegisterPage() {
  // States for all provider fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Plumber');
  const [emergencyService, setEmergencyService] = useState(false);
  
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const newProviderData = {
        name, email, password, serviceCategory, location, emergencyService,
        profile: { description, phone, email }
      };
      const data = await api.registerProvider(newProviderData);
      console.log(`Registration successful for ${data.name}! You can now log in.`);
    
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '600px' }}>
      <h2 className="auth-title">Join as a Provider</h2>
      <p className="auth-subtitle">Create your professional profile.</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}

        <div className="auth-form-grid">
          <div className="auth-input-group">
            <span className="auth-icon">👤</span>
            <input type="text" placeholder="Business / Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="auth-input-group">
            <span className="auth-icon">✉️</span>
            <input type="email" placeholder="Login Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-input-group">
            <span className="auth-icon">🔒</span>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
          </div>
          <div className="auth-input-group">
            <span className="auth-icon">📞</span>
            <input type="tel" placeholder="Public Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="auth-input-group">
            <span className="auth-icon">📍</span>
            <input type="text" placeholder="Location / City" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="auth-input-group">
            <span className="auth-icon">🛠️</span>
            <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)}>
              <option>Plumber</option>
              <option>Electrician</option>
              <option>Carpenter</option>
              <option>Painter</option>
              <option>Cleaner</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="auth-input-group">
          <textarea
            placeholder="Profile Description (Tell customers about your service)"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="auth-checkbox-group">
          <input
            type="checkbox"
            id="emergencyService"
            checked={emergencyService}
            onChange={(e) => setEmergencyService(e.target.checked)}
          />
          <label htmlFor="emergencyService">
            <span>⚡</span>
            Offer 24/7 Emergency Service?
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-full auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="auth-switch-link">
          Already have a provider account? 
          <Link to="/provider-login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ProviderRegisterPage;