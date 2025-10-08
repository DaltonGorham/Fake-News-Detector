import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupModal from '../components/SignupModal';
import { useAuth } from '../hooks/useAuth';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();
  const { login, signup, status, setStatus } = useAuth();

  const handleLogin = async () => {
    const { error } = await login(email, password);
    if (!error) {
      navigate('/');
    }
  };

  const handleSignup = async (signupEmail, signupPassword, signupUsername) => {
    const { error } = await signup(signupEmail, signupPassword, signupUsername);
    if (!error) {
      setShowSignupModal(false);
    }
  };

  return (
    <div id="login-container">
      <div id="logo-container">
        <img src="/logo.png" id="logo" alt="Fake-News Logo" />
      </div>
      <div id="login-box">
        <h1>Login</h1>
        <input
          id="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div id="login-buttons">
          <button id="login-btn" onClick={handleLogin}>Login</button>
          <button id="signup-btn" onClick={() => setShowSignupModal(true)}>Sign Up</button>
        </div>
        <p id="status">{status}</p>
        {showSignupModal && (
          <SignupModal
            onClose={() => {
              setStatus('');
              setShowSignupModal(false);
            }}
            onSignup={handleSignup}
            status={status}
          />
        )}
      </div>
    </div>
  );
}