import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { validatePassword } from '../util/validator';
import PasswordInput from '../components/common/PasswordInput';
import Loading from '../components/common/Loading';
import '../styles/ResetPasswordPage.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has a valid recovery token
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    try {
      validatePassword(newPassword);
    } catch (err) {
      setError(err.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setSuccess(true);
      
      // force sign out to make them log in again with new password
      await supabase.auth.signOut();
      

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <h2>Password Reset Successful!</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Reset Password</h2>

        <form onSubmit={handleResetPassword} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={isLoading}
              autoFocus
              showStrength={true}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="reset-submit-button"
            disabled={isLoading}
          >
            {isLoading ? <Loading inline /> : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="back-to-login-button"
            disabled={isLoading}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
