import React, { useState } from 'react';
import './styles.css';

export default function EmailVerification({ email, onBack, onResend }) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus('');
    try {
      const result = await onResend();
      if (result?.error) {
        setResendStatus(result.error.message || 'Failed to resend verification email.');
      } else {
        setResendStatus('Verification email sent!');
      }
    } catch {
      setResendStatus('Failed to resend verification email.');
    }
    setIsResending(false);
  };

  return (
    <div className="email-verification-container">
      <div className="verification-content">
        <h2>Almost there!</h2>
        <div className="verification-message">
          <p>We've sent a confirmation link to:</p>
          <strong className="email-highlight">{email}</strong>
        </div>
        <div className="verification-instructions">
          <p>Please check your inbox and click the link to activate your account.</p>
          <p className="secondary-text">
            Can't find the email? Check your spam folder or try resending.
          </p>
        </div>
        {resendStatus && (
          <div className="resend-status">{resendStatus}</div>
        )}
        <div className="verification-buttons">
          <button
            className="resend-btn"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </button>
          <button
            className="back-btn"
            onClick={onBack}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}