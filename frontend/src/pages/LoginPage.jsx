import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SignupModal from '../components/auth/SignupModal';
import EmailVerification from '../components/auth/EmailVerification';
import ForgotPassword from '../components/auth/ForgotPassword';
import { useAuth } from '../hooks/auth/useAuth';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  // This is a stupidly unelegant way to handle this but whatever 
  // just use the auth hook for everything i guess
  const { 
    login, 
    signup,
    resendVerificationEmail, 
    status, 
    setStatus, 
    pendingEmailVerification,
    setPendingEmailVerification 
  } = useAuth();

  const handleLogin = async () => {
    const { error } = await login(email, password);
    if (!error) {
      navigate('/dashboard');
    }
  };

  const handleSignup = async (signupEmail, signupPassword, signupUsername) => {
    const { error } = await signup(signupEmail, signupPassword, signupUsername);
    if (!error) {
      setShowSignupModal(false);
    }
  };

  const handleResendEmail = async () => {
    const { error } = await resendVerificationEmail(pendingEmailVerification);
  
    if (error) {
      if (error.status === 429) {
        return { 
          error: new Error('Too many requests. Please wait a moment before trying again.') 
        };
      }
      return { error };
    }
    
    return { error: null };
  };

  return (
    <div id="login-container">
      <div id="logo-container">
        <img src="/article-verify-logo.png" id="logo" alt="Fake-News Logo" />
      </div>
      <div id="login-box">
        {pendingEmailVerification ? (
          <EmailVerification 
            email={pendingEmailVerification}
            onBack={() => {
              setStatus('');
              setPendingEmailVerification(null);
            }}
            onResend={handleResendEmail}
          />
        ) : showForgotPassword ? (
          <ForgotPassword 
            onBack={() => {
              setStatus('');
              setShowForgotPassword(false);
            }}
          />
        ) : (
          <>
            <h1 className="login-title">Login</h1>
            <input
              id="email"
              type="text"
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
            <button 
              className="forgot-password-link"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </>
        )}
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