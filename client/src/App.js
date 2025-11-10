import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import api from './api'; // We'll need this

// Import Components & Pages
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProviderListPage from './pages/ProviderListPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
 
import LoginPage from './pages/UserLoginPage'; 

import UserRegisterPage from './pages/UserRegisterPage';
import ProviderLoginPage from './pages/ProviderLoginPage';
import ProviderRegisterPage from './pages/ProviderRegisterPage';

function App() {

  const [loggingIn, setLoggingIn] = useState(false);
  const [user, setUser] = useState(null); // This is our global user
  const navigate = useNavigate();

  // This function will be passed to LoginPage
  const handleUserLogin = async (email, password) => {
    setLoggingIn(true);
    try {
      // 1. Call your API
      const data = await api.loginUser({ email, password });
      
      // 2. Set the user state for the whole app
      setUser(data.user); // data.user is { name: '...', email: '...' }
      setLoggingIn(false);
      
      // 3. Redirect to homepage
      navigate('/');
      
    } catch (error) {
      setLoggingIn(false);
      console.error('Login failed:', error);
      throw error; 
    }
  };

  // This function will be passed to ProviderLoginPage
  const handleProviderLogin = async (email, password) => {
    setLoggingIn(true);
    try {
      const data = await api.loginProvider({ email, password });
      
      // We set the provider as the 'user' for the session
      setUser(data.provider); // data.provider is { id: '...', name: '...' }
      setLoggingIn(false);
      navigate('/');
      
    } catch (error) {
      setLoggingIn(false);
      console.error('Provider login failed:', error);
      throw error;
    }
  };

  // This function will be passed to the Navbar
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/providers" element={<ProviderListPage />} />
          <Route path="/providers/:id" element={<ProviderProfilePage />} />
          
          <Route 
            path="/login" 
            element={<LoginPage onLogin={handleUserLogin} loggingIn={loggingIn} />} 
          />
          <Route 
            path="/provider-login" 
            element={<ProviderLoginPage onLogin={handleProviderLogin} loggingIn={loggingIn} />} 
          />
          
          <Route path="/register" element={<UserRegisterPage />} />
          <Route path="/provider-register" element={<ProviderRegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;