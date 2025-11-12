import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Loading from '../../common/Loading';
import './styles.css';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage('Password reset link sent! Check your email.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <p className="forgot-password-description">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleResetPassword} className="forgot-password-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button
          type="submit"
          className="reset-button"
          disabled={isLoading}
        >
          {isLoading ? <Loading inline /> : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="back-to-login-button"
          disabled={isLoading}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
